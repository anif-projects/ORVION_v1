const QRCode = require('qrcode');
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const AppError = require('../utils/appError');
const crypto = require('crypto');

class CertificateService {
  async generateCertificate(studentId, courseId) {
    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId })
      .populate('student', 'name email')
      .populate('course', 'title');

    if (!enrollment) throw new AppError('Enrollment record not found', 404);
    if (enrollment.progressPercentage < 100) {
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
      pdfUrl: `/api/v1/certificates/view/${certHash}`,
    });

    return certificate;
  }
}

module.exports = new CertificateService();
