const Registration = require('../model/registration')
const sgMail = require('@sendgrid/mail');
require('dotenv').config()
sgMail.setApiKey(process.env.sendGridAPI)
const nodemailer = require('nodemailer');

exports.formSubmit = (req, res) => {
    console.log(req.body)
    let newReg = new Registration(req.body)
    
    newReg.save((err, success) => {
        if (err) {
            res.status(400).json({
                error: err
            })
        } else {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'mp06121@gmail.com',
                pass: '',
            }
        });
            
        const mailOptions = {
            from: 'mp06121@gmail.com',
            to: 'mp06121@gmail.com',
            // cc: 'helpdesk@fiveonline.in',
            subject: `Task Completed`,
            text: 'Attached is the generated PDF.', 
            attachments: [
                {
                    content: req.body.pdfFile,
                    filename:"task_1.pdf",
                    type: "application/pdf",
                    disposition: "attachment",
                }
            ]
        };
            
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
                res.send(error)
            } else {
                console.log('Email:', info.response);
                res.send(info)
            }
        });

        }
    })
}