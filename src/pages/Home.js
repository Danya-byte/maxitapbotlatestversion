import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../App.css";
import "../fire.scss";
import { AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { UserProvider } from "../context/userContext";
import { isIOS } from "react-device-detect"; // Добавьте этот импорт

const tele = window.Telegram.WebApp;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [restrictAccess, setRestrictAccess] = useState(false);

  // Остальной код...

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl flex justify-center">
          <div className="flex flex-col pt-3 space-y-3 w-full">
            <TonConnectUIProvider manifestUrl="https://maxitaps939v.netlify.app/tonconnect-manifest.json">
              <UserProvider>
                <AnimatePresence mode="wait">
                  {restrictAccess ? (
                    <>
                      <div className="w-full flex h-full justify-center px-5 items-center font-medium text-[20px]">
                        <div className="w-full pt-24 text-center flex flex-col space-y-3 justify-center items-center">
                          <p className="text-[28px] font-semibold">
                            Mobile rocks for gaming 😎 Open on your mobile device to play now!
                          </p>
                          <img
                            src="/maxitapqr.webp"
                            alt="plutotaps"
                            className="w-[250px] rounded-[25px] border-[2px] border-[#d9d9d9]"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Outlet />
                      <div
                        id="footermain"
                        className={`${
                          loading ? "invisible" : "visible"
                        } bg-[#171717] z-30 flex flex-col rounded-tr-[20px] rounded-tl-[20px] fixed bottom-0 ${
                          isIOS ? "pb-6" : "pb-3"
                        } left-0 right-0 justify-center items-center px-3 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:rounded-none sm:px-0`}
                      >
                        <Footer />
                        <div className="bg-[#171717] z-20 h-[67px] w-full fixed bottom-0 left-0 right-0 sm:hidden"></div>
                      </div>
                    </>
                  )}
                </AnimatePresence>
              </UserProvider>
            </TonConnectUIProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;