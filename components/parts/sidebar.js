import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import Link from 'next/link'
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import localStorage from 'localStorage';
import { faChalkboardTeacher, faUser, faHouseLaptop, faPeopleRoof,  } from '@fortawesome/free-solid-svg-icons';

const MenuItem = ({ condition, prop, icon, text }) => {
  return (condition) ? (
    <Link {...prop}>
      <a className="flex mx-auto w-4/5 items-center px-2 py-2 my-1 rounded-md bg-primary text-white border-2 border-transparent hover:border-primary hover:color-primary hover:bg-transparent transition-all duration-300 ease-in-out">
        <Icon icon={icon} width="24" height="24" className="mx-2 mr-4" />
        <p className="text-xl lg:text-2xl">{text}</p>
      </a>
    </Link>
  ) : (
    <Link {...prop}>
      <a className="flex mx-auto w-4/5 items-center px-2 py-2 my-1 rounded-md border-2 border-transparent hover:border-primary hover:color-primary transition-all duration-300 ease-in-out">
        <Icon icon={icon} width="24" height="24" className="mx-2 mr-4" />
        <p className="text-xl lg:text-2xl">{text}</p>
      </a>
    </Link>
  );
}

const LineTitle = ({ title }) => {
  return (
    <div className="flex flex-row mt-4 mb-2">
      <div className="w-1/5 h-0.5 bg-primary rounded-full my-3"></div>
      <p className="text-base font-semibold color-primary mx-2">{title}</p>
    </div>
  );
}

export default function sidebar({ isShow, setShow }) {
  const router = useRouter();
  const [isNotif, setNotif] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  return (
    <motion.div>
      <div
        className={
          (isShow ? "ease-in" : "ml-[-100%] ease-out") +
          " fixed top-0 flex flex-col overflow-y-auto h-screen w-auto shadow-md lg:ml-0 transition-all duration-700 translate-x-0 bg-white z-40 scrollbar-thin scrollbar-thumb-custom scrollbar-track-custom-light"
        }
      // onMouseLeave={(e) => setShow(e.target.checked)}
      >
        {/* logo */}
        <div className="flex justify-center items-center py-2 mb-4 lg:py-4 shadow-sm">          
          <div className="flex flex-wrap w-1/2 mx-2">
            <p className="text-base font-semibold uppercase leading-4">Data Siswa</p>
          </div>
        </div>
        {/* end logo */}
        {/* menu item */}
        <div className="mx-auto mb-5 flex flex-col w-full">                            
          { user ? user.type =='Guru' ?
            <div>
              <LineTitle title="Master" />
              <MenuItem
                condition={router.pathname === '/guru'}
                prop={{ href: "/guru" }}
                icon="mdi:human-male-board"
                text="GURU"
              />
              <MenuItem
                condition={router.pathname === '/siswa'}
                prop={{ href: "/siswa" }}
                icon="mdi:account-school"
                text="SISWA"
              />          
              <MenuItem
                condition={router.pathname === '/mataPelajaran'}
                prop={{ href: "/mataPelajaran" }}
                icon="mdi:laptop"
                text="MATA PELAJARAN"
              />
              <MenuItem
                condition={router.pathname === '/kelas'}
                prop={{ href: "/kelas" }}
                icon="mdi:home-account"
                text="KELAS"
              />
              <LineTitle title="Data Kelas" />
              <MenuItem
                condition={router.pathname === '/datakelas'}
                prop={{ href: "/datakelas" }}
                icon="mdi:account-group"
                text="Data Kelas"
              />                    
            </div> : 
            <div>
              <LineTitle title="Data Anda" />
              <MenuItem
                condition={router.pathname === '/datasiswa'}
                prop={{ href: "/datasiswa" }}
                icon="mdi:account-group"
                text="Data Anda"
              />                    
            </div> : <div></div>
          }
          <LineTitle title="Pengaturan" />
          <MenuItem
            condition={router.pathname === '/auth/reset-password'}
            prop={{ href: "/auth/reset-password" }}
            icon="akar-icons:gear"
            text="UBAH PASSWORD"
          />
        </div>
        {/* end menu item */}
      </div>
    </motion.div>
  )
}
