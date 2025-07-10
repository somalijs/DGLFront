import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { BsStripe, BsCSquareFill } from 'react-icons/bs';
// Assume these icons are imported from an icon library
import { ChevronDownIcon, HorizontaLDots } from '@/icons';
import { useSidebar } from '@/context/SidebarContext';
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Landmark,
  LayoutPanelLeft,
  ReceiptText,
  Store,
  BookMarked,
  UsersRound,
} from 'lucide-react';
import useAuth from '@/hooks/auth/use/useAuth';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};
const navItems: NavItem[] = [
  // {
  //   icon: <GridIcon />,
  //   name: 'Dashboard',
  //   subItems: [
  //     { name: 'Ecommerce', path: '/', pro: false },
  //     { name: 'Analytics', path: '/analytics', pro: true },
  //     { name: 'Marketing', path: '/marketing', pro: true },
  //     { name: 'CRM', path: '/crm', pro: true },
  //     { name: 'Stocks', path: '/stocks', new: true, pro: true },
  //     { name: 'SaaS', path: '/saas', new: true, pro: true },
  //   ],
  // },
  {
    icon: <LayoutPanelLeft />,
    name: 'Dashboard',
    path: '/',
  },
  {
    icon: <ReceiptText />,
    name: 'Sales',
    path: '/sales',
  },
];
const managerRoutes = [
  {
    icon: <BanknoteArrowDown />,
    name: 'Payments',
    path: '/payments',
  },
  {
    icon: <BanknoteArrowUp />,
    name: 'Payouts',
    path: '/payouts',
  },
  {
    icon: <BookMarked />,
    name: 'Reports',
    path: '/reports',
  },
];
const adminRoutes = [
  {
    icon: <BsCSquareFill />,
    name: 'Customers',
    path: '/customers',
  },
  {
    icon: <BsStripe />,
    name: 'Suppliers',
    path: '/suppliers',
  },
  {
    icon: <Store />,
    name: 'Stores',
    path: '/stores',
  },
  {
    icon: <Landmark />,
    name: 'Banks',
    path: '/banks',
  },

  {
    icon: <UsersRound />,
    name: 'Agents',
    path: '/agents',
  },
];
const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, toggleSidebar } = useSidebar();
  const location = useLocation();
  const { role } = useAuth().user;

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main' | 'support' | 'others';
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );
  let barLists = navItems;

  if (role === 'admin') {
    barLists = [...barLists, ...managerRoutes, ...adminRoutes];
  } else if (role === 'manager') {
    barLists = [...barLists, ...managerRoutes];
  }

  useEffect(() => {
    let submenuMatched = false;
    ['main', 'support', 'others'].forEach((menuType) => {
      const items = barLists;

      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as 'main' | 'support' | 'others',
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: 'main' | 'support' | 'others'
  ) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: 'main') => (
    <ul className='flex flex-col gap-4'>
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? 'menu-item-active'
                  : 'menu-item-inactive'
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'lg:justify-start'
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive'
                }`}
                onClick={toggleSidebar}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className='menu-item-text'>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? 'rotate-180 text-brand-500'
                      : ''
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                }`}
              >
                <span
                  onClick={toggleSidebar}
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className='menu-item-text'>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className='overflow-hidden transition-all duration-300'
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : '0px',
              }}
            >
              <ul className='mt-2 space-y-1 ml-9'>
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? 'menu-dropdown-item-active'
                          : 'menu-dropdown-item-inactive'
                      }`}
                    >
                      {subItem.name}
                      <span className='flex items-center gap-1 ml-auto'>
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? 'w-[290px]'
            : isHovered
            ? 'w-[290px]'
            : 'w-[90px]'
        }
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      // onMouseEnter={() => !isExpanded && setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        }`}
      >
        <Link onClick={toggleSidebar} to='/'>
          {isExpanded || isHovered || isMobileOpen ? (
            <div className='flex items-center overflow-hidden whitespace-nowrap'>
              <img src='/favicon.png' alt='Logo' width={40} height={40} />
              <h1 className='text-2xl ml-3 font-semibold text-[#209CEE]'>
                Point of Sale
              </h1>
            </div>
          ) : (
            <img src='/favicon.png' alt='Logo' width={32} height={32} />
          )}
        </Link>
      </div>
      <div className='flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar'>
        <nav className='mb-6'>
          <div className='flex flex-col gap-4'>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  'Menu'
                ) : (
                  <HorizontaLDots className='size-6' />
                )}
              </h2>
              {renderMenuItems(barLists, 'main')}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
