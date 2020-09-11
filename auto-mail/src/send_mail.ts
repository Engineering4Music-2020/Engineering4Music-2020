import nodemailer from "nodemailer";

const main = async() => {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "michael.schnyder.immer@gmail.com",
            pass: "IwadWStrasse31",
        },
    });

    let info = await transporter.sendMail({
        from: '"Michael Schnyder" michael.schnyder.immer@gmail.com',
        to: "michael@schnyder.cc",
        subject: "Hello",
        text: "Hello world",
        html: "<b>Hello world</b>",
    });

    console.log("Message sent %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

main().catch(console.error);