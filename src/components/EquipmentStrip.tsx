const EQUIPMENT_LINKS = [
  { href: 'https://amzn.to/49t6EJH', img: '/5.png?v=4' },
  { href: 'https://amzn.to/481BQNA', img: '/6.png?v=4' },
  { href: 'https://amzn.to/3K6X5FM', img: '/7.png?v=4' },
  { href: 'https://amzn.to/3WWwiyX', img: '/8.png?v=4' },
  { href: 'https://amzn.to/481w4vC', img: '/9.png?v=4' },
  { href: 'https://amzn.to/3K6XckG', img: '/10.png?v=4' },
];

export default function EquipmentStrip() {
  return (
    <section>
      <span className="eyebrow">Kit out your practice</span>
      <h2 className="mt-3 font-fraunces text-2xl font-semibold">
        Shop for pilates equipment
      </h2>
      <div className="mt-7 flex gap-4 overflow-x-auto pb-2">
        {EQUIPMENT_LINKS.map((item) => (
          <a
            key={item.img}
            href={item.href}
            target="_blank"
            rel="nofollow noopener noreferrer sponsored"
            className="shrink-0 overflow-hidden rounded-md border border-line bg-surface transition-colors hover:border-brand"
          >
            <img
              src={item.img}
              alt="Pilates equipment"
              width={160}
              height={160}
              loading="lazy"
              className="block h-40 w-40 object-cover"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
