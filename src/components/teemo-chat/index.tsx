"use client";

import { useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import ChatDisplay from "./chat-display";
import { Button } from "primereact/button";
import styles from "./index.module.css";

function TeemoChat() {
  const [open, setOpen] = useState(false);
  const dragControls = useDragControls();

  return (
    <>
      <motion.div
        className="fixed bottom-0 right-0 mb-4 mr-4"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        <Button
          rounded
          type="button"
          severity="contrast"
          className="w-16 h-16 pl-1"
          onClick={() => setOpen((curr) => !curr)}
          icon={<img src="/chatbot.svg" width={30} height={30} />}
        />
      </motion.div>
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            drag
            dragListener={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            dragControls={dragControls}
            className={clsx(
              "shadow-lg rounded-xl bg-gray-100 fixed bottom-0 right-0 mr-4 flex flex-col",
              styles.teemoChatContainer
            )}
          >
            <div className="flex justify-between items-center bg-white rounded-t-xl px-2">
              <div className="w-8 h-8" />
              <h3
                className="m-0 font-medium p-3 cursor-move"
                onPointerDown={(e) => dragControls.start(e)}
              >
                Teemo
              </h3>
              <div>
                <Button
                  text
                  rounded
                  icon="pi pi-times"
                  size="small"
                  severity="secondary"
                  className="w-8 h-8 p-0"
                  onClick={() => setOpen(false)}
                />
              </div>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ChatDisplay />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default TeemoChat;
