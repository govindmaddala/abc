require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bp = require('body-parser')
const winston = require('winston')
const morgan = require('morgan')
const axios = require('axios');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const app = express();
const { sequelize, connectDatabase } = require('./backend/models/connectDB')
const { ErrorHandleMiddleware } = require('./backend/middleware/ErrorHandleMiddleware')
const { Path404 } = require('./backend/middleware/Path404')
const { loggerHelper } = require('./backend/helpers/loggerHelper')
const port = process.env.PORT || 5000;
app.use(bp.urlencoded({ extended: true }))
app.use(bp.json())
app.use(morgan('dev'))
const path = require('path');
app.use(cors())

app.use(express.static("./backend/files"))

// const { encrypt } = require('node-qpdf2')
// import { encrypt } from "node-qpdf2";

app.get("/project-pdf1", async (req, res) => {
    // Replace with the actual URL of the API
    const apiUrl = 'http://localhost:5000/MyResume.pdf';

    await axios.get(apiUrl, { responseType: 'arraybuffer' })
        .then(async (response) => {
            const pdfBuffer = response.data;

            // Save the PDF buffer to a file
            const pdfFilePath = './document.pdf';
            fs.writeFileSync(pdfFilePath, pdfBuffer);

            // Proceed to set password
            // setPasswordOnPdf(pdfFilePath, './protected_document.pdf', 'yourpassword');
            const { encrypt } = await import('node-qpdf2');
            const pdf = {
                input: pdfFilePath,
                output: './protected_document.pdf',
                password: "1234",
            }

            await encrypt(pdf);
            res.status(200).json({ message: "Ok" })
        })
        .catch(error => {
            console.error('Error fetching the PDF:', error);
            res.status(400).json({ message: "Not Ok", message: error })
        });
})


const coherentpdf = require('coherentpdf');
app.get('/project-pdf', async (req, res) => {
    console.log(req.query.password)
    const apiUrl = 'http://localhost:5000/MyResume.pdf';
    try {
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const pdfBuffer = response.data;
        // Save the PDF buffer to a file
        const localFilePath = path.resolve('./document.pdf');
        const outputFilePath = path.resolve('./protected_docx.pdf');
        fs.writeFileSync(localFilePath, pdfBuffer);
        let pdfe = coherentpdf.fromFile(localFilePath, '');
        var permissions = [coherentpdf.noEdit];
        coherentpdf.toFileEncrypted(pdfe, coherentpdf.pdf40bit, permissions, 'owner', req.query.password, false, false, outputFilePath);
        fs.unlink(localFilePath, (err) => {
            if (err) {
                return;
            }
            console.log('File deleted successfully');
        });
        res.status(200).json({ message: 'Ok' });
    } catch (error) {
        console.error('Error fetching the PDF:', error);
        res.status(400).json({ message: 'Not Ok', error: error.message });
    }
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log', level: 'info' }),
    ],
});

const abc = async (htmlString, password) => {
    try {


        let pdfe = coherentpdf.fromFile(tempPath, '');
        var permissions = [coherentpdf.noEdit];
        coherentpdf.toFileEncrypted(pdfe, coherentpdf.pdf40bit, permissions, 'owner', password, false, false, tempPdfOutput);

        return tempPath;

    } catch (error) {
        console.error('Error createPdf:', error);
        throw error;
    }
}


global.db = sequelize
global.logger = logger

app.use("/api/v1/users", require('./backend/routes/users.routes'))
app.use(loggerHelper)
app.use(Path404)
app.use(ErrorHandleMiddleware)

app.listen(port, async () => {
    connectDatabase();
    console.log(`Server is up and running on ${port}`)
})
