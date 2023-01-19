
export function HomePage() {

    const cover = 'cover.png'
    return (
        <section>
            <img className="cover-img" src={require(`/src/assets/img/${cover}`)} />
        </section >
    )
}