export default {
  name: 'Banketam',
  title: 'Банкетам.Нет',
  description: 'Бронирование помещений для проведения банкетов',
  admin: {
    login: 'Admin26',
    password: 'Demo20'
  },
  application: {
    type: 'banquet_booking',
    fields: [
      {
        name: 'roomType',
        label: 'Помещение',
        type: 'select',
        required: true,
        options: [
          { value: 'hall', label: 'Зал' },
          { value: 'restaurant', label: 'Ресторан' },
          { value: 'summer_veranda', label: 'Летняя веранда' },
          { value: 'closed_veranda', label: 'Закрытая веранда' }
        ]
      },
      {
        name: 'startDate',
        label: 'Дата начала банкета',
        type: 'dateText',
        required: true,
        placeholder: 'ДД.ММ.ГГГГ',
        validation: {
          pattern: /^\d{2}\.\d{2}\.\d{4}$/,
          message: 'Формат: ДД.ММ.ГГГГ'
        }
      },
      {
        name: 'paymentMethod',
        label: 'Способ оплаты',
        type: 'select',
        required: true,
        options: [
          { value: 'qr', label: 'Предоплата по QR-коду' },
          { value: 'mir', label: 'Оплата картой МИР' },
          { value: 'office', label: 'Постоплата в офисе организации' }
        ]
      }
    ],
    statuses: {
      new: { label: 'Новая', color: 'blue' },
      assigned: { label: 'Банкет назначен', color: 'yellow' },
      completed: { label: 'Банкет завершен', color: 'green' }
    }
  },
  features: {
    reviews: true
  },
  labels: {
    applicationName: 'Заявка на бронирование',
    applicationNamePlural: 'Заявки на бронирование',
    createButton: 'Оформить бронирование',
    viewButton: 'Мои заявки'
  },
  contacts: {
    address: 'г. Москва, ул. Большая Ордынка, д. 15',
    phone: '+7 (495) 123-45-67',
    note: 'Организуем банкеты с изысканными блюдами и безупречной подачей.'
  }
}
