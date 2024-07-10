import { useState } from "react";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, BellIcon } from "@heroicons/react/24/outline";

export default function NavBar({ notifications }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-red-400">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-14 w-auto" src="./blogLogo.png" alt="" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a href="/" className="text-sm font-semibold leading-6 text-white ">
            Home
          </a>
          <a
            href="/create-article"
            className="text-sm font-semibold leading-6 text-white"
          >
            Create Article
          </a>
          <a
            href="/about"
            className="text-sm font-semibold leading-6 text-white"
          >
            About Us
          </a>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
          <button
            className="relative text-white p-2.5 rounded-md hover:bg-red-500"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>
          <a
            href="#"
            className="ml-6 text-sm font-semibold leading-6 text-white"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Home
                </a>
                <a
                  href="/create-article"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Create Article
                </a>
                <a
                  href="/about"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  About Us
                </a>
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log out
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
      {showNotifications && (
        <div className="fixed top-0 right-0 mt-16 mr-6 w-80 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <ul className="mt-4 space-y-2">
              {notifications.map((notification, index) => (
                <li
                  key={index}
                  className={`p-2 border rounded ${
                    notification.type === "new"
                      ? "border-green-500"
                      : notification.type === "edit"
                      ? "border-yellow-500"
                      : "border-red-500"
                  }`}
                >
                  {notification.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
