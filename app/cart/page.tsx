"use client";

import { useState } from "react";
import styles from "./cart.module.css";
import Link from "next/link";
interface CartItem{
    id:number;
    name:string;
    price:number;
    image:string;
    quantity:number;
    shade?:string;
}
export default function Cart(){
    const [productadded,setProductAdded]= useState<CartItem[]>([]);

    const updateQty=(id:number,diff:number)=>
        {
        setProductAdded(
            i => i.map(
                item=>
                item.id === id ? {...item,quantity: 
                    item.quantity+ diff
                }:item
            )
        );
    }
    const remove=(id:number)=>
        setProductAdded(
           prod =>prod.filter(item=>item.id !==id)
        );
    const totalPrice = productadded.reduce((sum,i)=>{
        return (sum + i.price*i.quantity)
    },0);

    if(productadded.length===0) return
       ( <main className={styles.page}>
        <h1 className={styles.title}>Shopping Bag</h1>
            <div className={styles.empty}>
                <p>No items in the Shopping Bag</p>
                <Link href="/shop" className={styles.btnPrimary}>Continue shopping</Link>
            </div>
       </main>
       );
    
    
    return(
        <main className={styles.page}>
           <h1 className={styles.title}>Shopping Bag</h1>
        <div className={styles.layout}>
        <ul className={styles.itemList}>
            {productadded.map(prod=>
                <li 
                key={prod.id}
                className={styles.items}>
                    <img src={prod.image} alt={prod.name} className={styles.itemImg}/>
                    <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{prod.name}</p>
                         {prod.shade && <p className={styles.itemShade}>Shade: {prod.shade}</p>}
                         <p className={styles.itemPrice}>${prod.price}</p>
                    </div>

                    <div className={styles.itemActions}>
                        <button onClick={()=> remove(prod.id)} className={styles.removeBtn} aria-label="Remove">
                  🗑</button>
                    <div className={styles.qtyRow}>
                        <button onClick={()=>updateQty(prod.id,-1)}>-1</button>
                        <span>{prod.quantity}</span>
                        <button onClick={()=>updateQty(prod.id,+1)}>+1</button>
                    </div>
                    </div>
                </li>
            )}
        </ul> 

      <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
 
          <div className={styles.summaryRow}>
            <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span><span>${}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span><span>${totalPrice.toFixed(2)}</span>
          </div>
 
          <Link href="/checkout" className={styles.btnPrimary}>Proceed to Checkout</Link>
          <Link href="/shop"     className={styles.btnOutline}>Continue Shopping</Link>
        </aside>

        </div>
        </main>
    );
}