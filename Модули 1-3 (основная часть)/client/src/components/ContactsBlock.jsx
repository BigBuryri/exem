export default function ContactsBlock() {
  return (
    <section className="card-static h-full">
      <h2>Контакты</h2>
      <p className="text-sm mt-2">г. Москва, ул. Большая Ордынка, д. 15</p>
      <a href="tel:+74951234567" className="text-sm text-banquet-red mt-1 inline-block hover:underline">
        +7 (495) 123-45-67
      </a>
      <p className="text-secondary mt-2">
        Банкеты с продуманным меню и вниманием к деталям.
      </p>
    </section>
  )
}
