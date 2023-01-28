import React from 'react'
import { Link } from "react-router-dom"
import { Header } from '../cmps/header'

export function HomePage() {

    const cover = 'cover.png'

    return (
        <section className='home-page'>
            <Header />
            <div className="home-page-main flex">
                <div className="cover-title-wrap">
                    <h1> A platform built for a new way of working</h1>
                </div>
                {/* <p>What would you like to manage with Funnday?</p> */}
                <p>Manage your information in an easy, clear, fast and smart way</p>
                <Link className='see-demo' to="/board/63d405e743010daa20233aab"> See Demo ⇨</Link>
            </div>
            <img className="cover-img" src={require(`/src/assets/img/${cover}`)} />

        </section >
    )
}

                        //     <img alt="Genpact" class="jsx-4212101279 " src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/genpact.png">
                        //    <img alt="HoltCat" class="jsx-4212101279 " src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/HoltCat.png">
                        //     <img alt="Canva" class="jsx-4212101279 " src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/canva.png">
                        //     <img alt="Coca Cola" class="jsx-4212101279 " src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/coca_cola.png">
                        //     <img alt="Lionsgate" class="jsx-4212101279 " src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/lionsgate.png">
                        //     <img alt="Hulu" class="jsx-4212101279 " src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/hulu.png">
                        //     <img alt="BD" class="jsx-4212101279 " src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/bd.png">
                        //     <img alt="Electronic Arts" class="jsx-4212101279 " src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/Electronic_Arts.png">
                        //     <img alt="Universal Music Group" class="jsx-4212101279 " src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/universal.png">
