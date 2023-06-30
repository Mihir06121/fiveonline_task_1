const Registration = require('../model/registration')
const sgMail = require('@sendgrid/mail');
require('dotenv').config()
sgMail.setApiKey(process.env.sendGridAPI)
const nodemailer = require('nodemailer');

exports.formSubmit = (req, res) => {
    console.log(req.body)
    let newReg = new Registration(req.body)
    const pdfBuffer = Buffer.from(req.body.pdfFile, 'base64');
    newReg.save((err, success) => {
        if (err) {
            res.status(400).json({
                error: err
            })
        } else {

            // SENDGRID PART

            const createCenterEmail = { to: req.body.workEmailId, 
            from: 'mp06121@gmail.com',
            cc: 'helpdesk@fiveonline.in',
            subject: `Task Completed`,
            text: 'Attached is the generated PDF.', 
            attachments: [
                {
                    content: pdfBuffer.toString('base64'),
                    filename:"task_1.pdf",
                    type: "application/pdf",
                    disposition: "attachment",
                }
            ]
    
        }
        sgMail.send(createCenterEmail)
            .then(sent =>  {
                console.log('SENT >>>', sent)
                res.send(success)
            }) 
            .catch(err =>  {
                console.log('ERR >>>', JSON.stringify(err))
                res.send(err)
            }); 

            // GOOGLE ID SMTP

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'mp06121@gmail.com',
                pass: process.env.G_PASS,
            }
        });
            
        const mailOptions = {
            from: 'mp06121@gmail.com',
            to: req.body.workEmailId,
            cc: 'helpdesk@fiveonline.in',
            subject: `Task Completed`,
            text: 'Attached is the generated PDF.', 
            attachments: [
                {
                    content: pdfBuffer.toString('base64'),
                    filename:"task_1.pdf",
                    type: "application/pdf",
                    disposition: "attachment",
                }
            ]
        };
            
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email:', info.response);
            }
        });

        }
    })
}