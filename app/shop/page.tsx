"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import styles from './shop.module.css';
const API='http://localhost:4000/api';

const ranges = [
    {label: 'All Prices', min:undefined , max:undefined},
    {label: 'Under $25', min:'0', max:'25'},
    {label: '$25 - $50', min:'25', max:'50'},
    {label: '$50 - $100', min:'50', max:'100'},
    {label:'Over $100', min:'100', max:undefined},];

const Sorting=[
    {value:'',label:'Featured'},
    {value:'price_asc',label:'Price: Low to High'},
    {value:'price_desc',label:'Price: High to Low'},
    {value:'name_asc',label:'Name: A to Z'}];


export default function Shop(){
    const [products,setProducts]=useState<{
        id: string | number;
        name: string;
        category: string;
        price: number;
        image: string;
    }[]>([]);
    const [categories,setCategories]=useState(['all']);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState('');

    //filter
    const [category,setCategory]=useState('all');
    const [priceI,setPriceI]=useState(0);
    const [sort,setSort] = useState('');
    const [showFilter,setShowFilter]=useState(false);

    useEffect(()=>{
        fetch(`${API}/categories`)
        .then(r=>r.json())
        .then(data=> setCategories(['all',...data]))
        .catch(()=>{/*this keep default*/ })
    },[]);
    
    useEffect(()=>{
        setLoading(true);
        setError('');

        const params = new URLSearchParams();
        if(category!== 'all') params.set('category',category);
        const {min,max} = ranges[priceI];
        if(min!== undefined) params.set('min', min);
        if(max!== undefined) params.set('max',max);
        if(sort) params.set('sort',sort);

        fetch(`${API}/products?${params}`)
        .then(r =>{if(!r.ok) throw new Error(); return r.json()})
        .then(data => setProducts(data))
        .catch(()=>setError('No loaded products,Is the server running?'))
        .finally(()=> setLoading(false))
    },[category,priceI,sort])

    return(
        <main className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>Our Products</h1>
                {/* category tabs */}
                <nav className={styles.nav}>
                    {categories.map(cat=>(
                        <button key={cat} 
                        onClick={()=> setCategory(cat)}  className={`${styles.tab} ${category === cat ? styles.tabActive : ''}`}> {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}</button>
                    ))}
                </nav>
                {/* toolbar */}
                <div className={styles.toolbar}>
                    <button
                    aria-label="Toggle filters" title="Toggle filters" className={styles.filerBtn}
                    onClick={()=>setShowFilter(v=>!v)}></button>
                    {/* filters */}
                    <div className={styles.right}>
                        <span className={styles.count}>{products.length}</span>
                        <select aria-label="Sort products"
                        value={sort}
                        onChange={e=>setSort(e.target.value)} className={styles.select}>
                            {Sorting.map(o=>(
                                <option key={o.value}value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                        {/* price filter */}
                {
                  showFilter && (
                    <div className={styles.filterPanel}>
                        <p className={styles.filterTitle}>Price Range</p>
                        <div className={styles.chips}>
                            {ranges.map((r,i)=>(
                                <button key={r.label}
                                onClick={()=> setPriceI(i)}
                                className={`${styles.chip} ${priceI === i ? styles.chipActive : ''}`}>{r.label}</button>
                            ))}
                        </div>
                    </div>
                  )}
                {/* states */}
                {error && <p className={styles.error}>{error}</p>}
                {loading && <p className={styles.loading}>{loading}</p>}
                {/* grid */}
                {!loading && !error && (products.length === 0) ? <p className={styles.empty}>No products match ur filter</p>
                :(
                    <ul className={styles.grid}>
                        {products.map(p=>(
                            <li key={p.id}>
                                <Link href={`/product/${p.id}`} className={styles.card}>
                                <div className={styles.imgWrap}>
                                    <img 
                                    src={p.image} alt={p.name} className={styles.img}/>
                                    </div>
                                    
                      <p className={styles.pName}>{p.name}</p>
                      <p className={styles.pCat}>{p.category}</p>
                      <p className={styles.pPrice}>${Number(p.price).toFixed(2)}</p>
                                    </Link>
                            </li>
                        ))}
                    </ul>
                )} 
            </div>

        </main>
    );
}