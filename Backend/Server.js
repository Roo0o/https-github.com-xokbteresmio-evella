require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user:   process.env.DB_USER,
    password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME
    
});

db.connect((err)=>{
    if(err){
        console.log('DB connection failed :',err); process.exit(1);
    }
    console.log('Connected to MYSQL');
});

app.get('/api/products',(req,res)=>{
    const {category,min,max,sort} = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params =[]

    if(category && category !== 'all'){
        sql+='AND category >= ?';
        params.push(category);
    }
    if(min!== undefined){
        sql+='AND price >= ?';
        params.push(Number(min));
    }
    if(max!==undefined){
        sql+='AND price <= ?';
        params.push(Number(max));
    }
    const sortMap = {
            price_asc: 'price ASC',
            price_desc: 'price DESC',
            name: 'name ASC',
        };
        sql+= ` ORDER BY ${sortMap[sort] ?? 'id ASC'}`;
        db.query(sql, params, (err, rows) =>{
            if(err) return res.status(500).json({ error: 'Database error'});
            res.json(rows);
        });
    });

app.get('/api/categories', (_req,res)=>{
    db.query('SELECT DISTINCT category FROM products ORDER BY category', (err, rows)=>{
        if(err) return res.status(500).json({error: 'Database error'});
        res.json(rows.map(r=> r.category));
    });
});

app.listen(4000, ()=> console.log('ruuning ot http://localhost:4000'));