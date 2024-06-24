import { Footer } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BsInstagram, BsFacebook , BsTwitter , BsGithub } from 'react-icons/bs'
import React from 'react'

export default function MAFooter() {
  return (
    <Footer container className='border border-t-8 border-blue-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link to='/' className='self-center whitespace-nowrap  text-xl font-semibold'>
              <span className='px-2 py-1  bg-gradient-to-r from-blue-500 via-sky-300 to-blue-500 text-white rounded-lg'>Rehman's</span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://www.100jsprojects.com'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  100 JS Projects
                </Footer.Link>
                <Footer.Link
                  href='/about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Rehman's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow us' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://github.com/a-rehman01'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  GitHub
                </Footer.Link>
                <Footer.Link
                  href='#'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='#'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  href='#'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="Rehman's Blog"
            year={new Date().getFullYear()}
          />
          <div className='flex gap-5 mt-4 sm:mt-0 md:justify-between'>
            <Footer.Icon className='hover:text-gray-400' href='#' icon={BsFacebook} />
            <Footer.Icon className='hover:text-gray-400' href='#' icon={BsInstagram} />
            <Footer.Icon className='hover:text-gray-400' href='#' icon={BsTwitter} />
            <Footer.Icon className='hover:text-gray-400' href='#' icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  )
}
