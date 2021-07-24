require('dotenv').config()
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');



       async function startupApp() {
        try {
            const connection = await mysql.createConnection({

                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
            
        });

    }
        catch (error) {
            console.error(error.message);
        }
    
    }




startupApp()
