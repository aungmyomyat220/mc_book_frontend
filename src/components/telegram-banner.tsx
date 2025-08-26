// TelegramBanner component displays a banner prompting users to join the Telegram channel.
import Image from 'next/image';

export default function TelegramBanner() {
  return (
    <div className='flex justify-center items-center md:text-xl border-2 border-blue-400 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 text-gray-900 py-3'>
        <a
          href='https://t.me/myanmar_comic'
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 no-underline hover:underline hover:text-blue-800 transition-colors duration-150'
        >
            {/* Telegram Icon */}
            <div className="w-5 h-5">
              <Image
                src="/telegram.png"
                alt="Telegram logo"
                width={20}
                height={20}
                className="w-full h-full object-contain"
              />
            </div>
            Telegram Channel ကို Join ရန်နှိပ်ပါ။
        </a>
    </div>
  )
}
