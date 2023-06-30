const Registration = require('../model/registration')
const sgMail = require('@sendgrid/mail');
require('dotenv').config()
sgMail.setApiKey(process.env.sendGridAPI)
const nodemailer = require('nodemailer');
const fs = require('fs')
const util = require("util");

exports.formSubmit = (req, res) => {
    console.log(req.body)
    let newReg = new Registration(req.body)
    // let bufferedData = Buffer.from(req.body.pdfFile, 'base64')
    // var bin = Base64.atob(req.body.pdfFile);
    fs.writeFileSync("sample.pdf", req.body.slicedPdf, 'base64');
    // let binData = fs.writeFile('result_binary.pdf', bin, 'binary');
    // console.log(bin)
    var pdfData = fs.readFileSync("sample.pdf");
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
                    pass: 'juadhycgwbfujqtl',
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
                        content: pdfData,
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