import config from '@/config.json'
import Image from 'next/image'
import React from 'react'



const navigation = {
  social: [
      {
        name: 'GitHub',
        href: config.links.github,
        icon: '/github.svg',
      },
      {
        name: 'Discord',
        href: config.links.discord,
        icon: '/discord.svg',
      },
      {
        name: 'X',
        href: config.links.x,
        icon: '/x.svg',
      },
      {
        name: 'Telegram',
        href: config.links.telegram,
        icon: '/telegram.svg',
      },
  ],
}


export const Footer = () => {
  return (
    <footer className='mt-8 bg-transparent'>
      <div className='mx-auto flex max-w-7xl flex-col items-center overflow-hidden px-6 py-12 lg:px-8'>

          <div className="flex items-center space-x-4 ml-4">
            {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="fill-current text-green-500 hover:text-green-300 transition-colors"
                aria-label={item.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                 <Image src={item.icon} alt={item.name} width={24} height={24} />
              </a>
            ))}
          </div>
      </div>
    </footer>
  )
}
