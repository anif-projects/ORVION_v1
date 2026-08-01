const QRCode = require('qrcode');
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const AppError = require('../utils/appError');
const crypto = require('crypto');

class CertificateService {
  async generateCertificate(studentId, courseId) {
    const Course = require('../models/Course');
    const LessonProgress = require('../models/LessonProgress');

    const enrollment = await Enrollment.findOne({ studentId: studentId, courseId: courseId })
      .populate('studentId', 'name email')
      .populate('courseId', 'title');

    if (!enrollment) throw new AppError('Enrollment record not found', 404);

    const course = await Course.findById(courseId);
    if (!course) throw new AppError('Course not found', 404);

    // Calculate total lessons in course modules
    let totalLessons = 0;
    if (course.modules && Array.isArray(course.modules)) {
      course.modules.forEach(mod => {
        if (mod.lessons && Array.isArray(mod.lessons)) {
          totalLessons += mod.lessons.length;
        }
      });
    }

    // Count completed lessons for student in course
    const completedCount = await LessonProgress.countDocuments({
      student: studentId,
      course: courseId,
      isCompleted: true
    });

    if (totalLessons > 0 && completedCount < totalLessons) {
      throw new AppError('Course must be 100% completed to issue a certificate', 400);
    }

    const existingCert = await Certificate.findOne({ student: studentId, course: courseId });
    if (existingCert) return existingCert;

    const certHash = crypto.createHash('sha256').update(`${studentId}-${courseId}-${Date.now()}`).digest('hex').substring(0, 16).toUpperCase();
    const qrData = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-certificate/${certHash}`;
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    const certificate = await Certificate.create({
      certificateHash: certHash,
      student: studentId,
      course: courseId,
      qrCodeUrl,
      pdfUrl: `/api/v1/certificates/download/${certHash}`,
    });

    return certificate;
  }

  async generatePdf(certificate) {
    const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
    const QRCode = require('qrcode');

    const studentName = certificate.student?.name || 'Student';
    const courseTitle = certificate.course?.title || 'Course';
    const issueDate = new Date(certificate.issueDate || Date.now()).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const hash = certificate.certificateHash;

    let pdfDoc;

    if (certificate.course?.certificateTemplate) {
      // 1. Load custom uploaded PDF template
      try {
        let base64 = certificate.course.certificateTemplate;
        if (base64.startsWith('data:application/pdf;base64,')) {
          base64 = base64.replace('data:application/pdf;base64,', '');
        }
        const pdfBytes = Buffer.from(base64, 'base64');
        pdfDoc = await PDFDocument.load(pdfBytes);
      } catch (err) {
        console.error('Failed to load custom PDF template, falling back to default:', err);
      }
    }

    if (!pdfDoc) {
      // 2. Generate default professional certificate from scratch
      pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([842, 595]); // A4 Landscape
      const { width, height } = page.getSize();

      // Draw clean background
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(0.99, 0.99, 0.97),
      });

      // Draw outer borders
      page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: height - 40,
        borderColor: rgb(0.76, 0.6, 0.33), // Gold border
        borderWidth: 2,
      });

      page.drawRectangle({
        x: 26,
        y: 26,
        width: width - 52,
        height: height - 52,
        borderColor: rgb(0.76, 0.6, 0.33), // Thin inner gold border
        borderWidth: 1,
      });

      // Embed fonts
      const fontTitle = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      const fontBodyText = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
      const fontMain = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSecondary = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Draw Header
      const headerText = 'CERTIFICATE OF COMPLETION';
      const headerWidth = fontTitle.widthOfTextAtSize(headerText, 32);
      page.drawText(headerText, {
        x: (width - headerWidth) / 2,
        y: height - 120,
        size: 32,
        font: fontTitle,
        color: rgb(0.12, 0.18, 0.29),
      });

      // Sub-header
      const subHeader = 'This is proudly presented to';
      const subHeaderWidth = fontBodyText.widthOfTextAtSize(subHeader, 16);
      page.drawText(subHeader, {
        x: (width - subHeaderWidth) / 2,
        y: height - 170,
        size: 16,
        font: fontBodyText,
        color: rgb(0.4, 0.45, 0.55),
      });

      // Student Name
      const nameWidth = fontMain.widthOfTextAtSize(studentName, 36);
      page.drawText(studentName, {
        x: (width - nameWidth) / 2,
        y: height - 240,
        size: 36,
        font: fontMain,
        color: rgb(0.76, 0.6, 0.33), // Gold color
      });

      // Completion text
      const compText = 'for successfully completing the online curriculum of';
      const compWidth = fontBodyText.widthOfTextAtSize(compText, 14);
      page.drawText(compText, {
        x: (width - compWidth) / 2,
        y: height - 290,
        size: 14,
        font: fontBodyText,
        color: rgb(0.3, 0.35, 0.45),
      });

      // Course Title
      const titleWidth = fontMain.widthOfTextAtSize(courseTitle, 22);
      page.drawText(courseTitle, {
        x: (width - titleWidth) / 2,
        y: height - 340,
        size: 22,
        font: fontMain,
        color: rgb(0.12, 0.18, 0.29),
      });

      // Certificate Verification Details (Bottom Center)
      const credText = `Verify at: ${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-certificate/${hash}`;
      const credWidth = fontSecondary.widthOfTextAtSize(credText, 8);
      page.drawText(credText, {
        x: (width - credWidth) / 2,
        y: 40,
        size: 8,
        font: fontSecondary,
        color: rgb(0.5, 0.55, 0.65),
      });

      const hashText = `Credential ID: ${hash}`;
      const hashWidth = fontSecondary.widthOfTextAtSize(hashText, 9);
      page.drawText(hashText, {
        x: (width - hashWidth) / 2,
        y: 55,
        size: 9,
        font: fontSecondary,
        color: rgb(0.3, 0.35, 0.4),
      });

      // Date of completion
      const dateLabel = 'DATE OF COMPLETION';
      page.drawText(dateLabel, {
        x: 100,
        y: 90,
        size: 10,
        font: fontSecondary,
        color: rgb(0.5, 0.55, 0.65),
      });

      page.drawLine({
        start: { x: 70, y: 110 },
        end: { x: 230, y: 110 },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });

      const dateValueWidth = fontSecondary.widthOfTextAtSize(issueDate, 12);
      page.drawText(issueDate, {
        x: 150 - dateValueWidth / 2,
        y: 120,
        size: 12,
        font: fontSecondary,
        color: rgb(0.1, 0.15, 0.2),
      });

      // Signature
      const sigLabel = 'AUTHORIZED SIGNATURE';
      page.drawText(sigLabel, {
        x: width - 230,
        y: 90,
        size: 10,
        font: fontSecondary,
        color: rgb(0.5, 0.55, 0.65),
      });

      page.drawLine({
        start: { x: width - 260, y: 110 },
        end: { x: width - 70, y: 110 },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });

      // Mock Signature Text
      const sigText = 'Orvion Academy';
      const sigTextWidth = fontBodyText.widthOfTextAtSize(sigText, 18);
      page.drawText(sigText, {
        x: width - 165 - sigTextWidth / 2,
        y: 120,
        size: 18,
        font: fontBodyText,
        color: rgb(0.12, 0.18, 0.29),
      });
    } else {
      // 3. For Custom PDF Template: Draw names & text dynamically using layout configuration
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const fontMain = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSecondary = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Parse custom layouts (fallbacks to default height ratios if not set)
      let layout = {};
      if (certificate.course?.certificateLayout) {
        try {
          layout = typeof certificate.course.certificateLayout === 'string'
            ? JSON.parse(certificate.course.certificateLayout)
            : certificate.course.certificateLayout;
        } catch (e) {
          console.error('Failed to parse certificateLayout:', e);
        }
      }

      // Student Name layout
      const nameLayout = layout.studentName || {};
      const nameFontSize = Number(nameLayout.fontSize) || 26;
      const nameWidth = fontMain.widthOfTextAtSize(studentName, nameFontSize);
      const nameX = nameLayout.isCentered !== false
        ? (width - nameWidth) / 2
        : (Number(nameLayout.x) || 50);
      const nameY = nameLayout.y !== undefined
        ? Number(nameLayout.y)
        : (height * 0.55);

      firstPage.drawText(studentName, {
        x: nameX,
        y: nameY,
        size: nameFontSize,
        font: fontMain,
        color: rgb(0.12, 0.18, 0.29),
      });

      // Course Name layout
      const courseLayout = layout.courseTitle || {};
      const courseFontSize = Number(courseLayout.fontSize) || 18;
      const courseWidth = fontMain.widthOfTextAtSize(courseTitle, courseFontSize);
      const courseX = courseLayout.isCentered !== false
        ? (width - courseWidth) / 2
        : (Number(courseLayout.x) || 50);
      const courseY = courseLayout.y !== undefined
        ? Number(courseLayout.y)
        : (height * 0.42);

      firstPage.drawText(courseTitle, {
        x: courseX,
        y: courseY,
        size: courseFontSize,
        font: fontMain,
        color: rgb(0.12, 0.18, 0.29),
      });

      // Completion Date layout
      const dateLayout = layout.issueDate || {};
      const dateFontSize = Number(dateLayout.fontSize) || 12;
      const dateWidth = fontSecondary.widthOfTextAtSize(issueDate, dateFontSize);
      const dateX = dateLayout.isCentered !== false
        ? (width - dateWidth) / 2
        : (Number(dateLayout.x) || 50);
      const dateY = dateLayout.y !== undefined
        ? Number(dateLayout.y)
        : (height * 0.30);

      firstPage.drawText(issueDate, {
        x: dateX,
        y: dateY,
        size: dateFontSize,
        font: fontSecondary,
        color: rgb(0.3, 0.35, 0.45),
      });

      // Verification Hash
      const hashText = `Credential ID: ${hash}`;
      firstPage.drawText(hashText, {
        x: 50,
        y: 40,
        size: 8,
        font: fontSecondary,
        color: rgb(0.5, 0.55, 0.65),
      });
    }

    // 4. Generate & embed QR Code on both default/custom templates
    try {
      const qrData = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-certificate/${hash}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, { margin: 1 });
      const qrCodeBase64 = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
      const qrCodeBuffer = Buffer.from(qrCodeBase64, 'base64');
      
      const qrImage = await pdfDoc.embedPng(qrCodeBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width } = firstPage.getSize();

      firstPage.drawImage(qrImage, {
        x: width - 110,
        y: 40,
        width: 70,
        height: 70,
      });
    } catch (qrErr) {
      console.error('Failed to embed QR code in certificate PDF:', qrErr);
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}

module.exports = new CertificateService();
