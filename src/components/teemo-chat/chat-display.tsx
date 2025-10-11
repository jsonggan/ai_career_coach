"use client";

import { useCallback, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import remarkGfm from "remark-gfm";
import clsx from "clsx";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import styles from "./index.module.css";
import ReactMarkdown from "react-markdown";
import ChatTools from "./chat-tools";
import { useProjectList } from "@/query/projects";
import { useCreateProjectDialogStore } from "@/store/create-dialog";

const prompts = [
  "Help me create a new project",
  "Please update a project for me",
  "Summarise a project for me",
];

function ChatDisplay() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { refetch } = useProjectList();
  const { openDialog } = useCreateProjectDialogStore();

  const {
    messages,
    isLoading,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    append,
  } = useChat({
    maxToolRoundtrips: 10,
  });

  const scrollToBottom = useCallback(() => {
    if (!scrollAreaRef.current) {
      return;
    }

    scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
  }, [scrollAreaRef]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    scrollToBottom();
    setTimeout(refetch, 2000);
  }, [isLoading, refetch, scrollAreaRef]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  function adjustTextAreaHeight() {
    if (!textAreaRef.current) {
      return;
    }

    textAreaRef.current.style.height = "inherit";
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  }

  const onChatInputKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        event.preventDefault(); // Prevent default behavior (new line)
        setInput((chat) => `${chat}\n`);
      } else {
        event.preventDefault(); // Prevent default behavior (submit form)
        // Here you can handle form submission logic, e.g., submitForm();
        handleSubmit();
        setTimeout(adjustTextAreaHeight, 50);
      }
    }
  };

  return (
    <div className="flex flex-column h-full min-h-0 flex-1">
      <div
        ref={scrollAreaRef}
        className="flex-1 min-h-0 overflow-y-auto p-2 pr-3"
      >
        {messages.length <= 0 ? (
          <div className="flex gap-2">
            <div className="flex-0">
              <img src="/chatbot.svg" width={30} height={30} />
            </div>
            <div
              className={clsx(
                "flex-1 flex flex-column gap-2",
                styles.assistantMessage
              )}
            >
              <p className="m-0 text-color text-sm">
                How can I help you today?
              </p>
              {prompts.map((prompt) => (
                <div key={prompt}>
                  <Button
                    key={prompt}
                    label={prompt}
                    rounded
                    size="small"
                    className="py-2 px-3"
                    onClick={() => {
                      setInput(prompt);
                      setTimeout(() => textAreaRef.current?.focus(), 200);
                    }}
                    pt={{
                      label: {
                        className: "text-left font-light",
                      },
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-column gap-2 pt-2">
            {messages.map((msg, idx) => {
              const { id, role, content } = msg;
              const prevMessage = messages[idx - 1];
              const isLastMessage = idx === messages.length - 1;
              if (!content) {
                return;
              }

              return role === "user" ? (
                <div
                  key={id}
                  className="surface-card border-round-2xl px-3 py-2 align-self-end mt-2 mb-1"
                  style={{ maxWidth: "80%", whiteSpace: "pre-line" }}
                >
                  <p className="m-0 text-color text-sm">{content}</p>
                </div>
              ) : (
                <div key={id} className="flex flex-column gap-1">
                  <div className="flex gap-2">
                    <div className="flex-0">
                      {isLastMessage && isLoading ? (
                        <div
                          className="flex align-items-center justify-content-center"
                          style={{ width: 30, height: 30 }}
                        >
                          <div className={styles.loader} />
                        </div>
                      ) : (
                        <img src="/chatbot.svg" width={30} height={30} />
                      )}
                    </div>
                    <div
                      className={clsx(
                        "flex-1 flex flex-column gap-2",
                        styles.assistantMessage
                      )}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        className="chat-markdown"
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  {(isLastMessage && isLoading) ||
                    (prevMessage.toolInvocations?.length && (
                      <>
                        <ChatTools
                          invocations={prevMessage.toolInvocations}
                          interactionDisabled={!isLastMessage || isLoading}
                          onProjectSelect={(project) => {
                            append({
                              role: "user",
                              content: `Project ID: ${project.id}\nProject Name: ${project.name}`,
                            });
                          }}
                          onTimelineChangeRequest={(start, end) => {
                            append({
                              role: "user",
                              content: `Timeline: ${start} - ${end}`,
                            });
                          }}
                          onObjectiveDeleteRequest={(objective) => {
                            append({
                              role: "user",
                              content: `I want to delete objective with ID: ${objective.id}`,
                            });
                          }}
                          onObjectiveSelect={(objective) => {
                            append({
                              role: "user",
                              content: `I want to update objective with ID: ${objective.id}`,
                            });
                          }}
                          onObjectiveUpdateRequest={(objective) => {
                            append({
                              role: "user",
                              content: `I want to update objective with ID: ${objective.id} with\nname: ${objective.name}\ndescription: ${objective.description}`,
                            });
                          }}
                          onStatusUpdate={(status) => {
                            append({
                              role: "user",
                              content: `I want to update status to: ${status}`,
                            });
                          }}
                          onProjectAspectClick={(aspect) => {
                            append({
                              role: "user",
                              content: `I want to update ${aspect}`,
                            });
                          }}
                          onRoleDeleteRequest={(role) => {
                            append({
                              role: "user",
                              content: `I want to delete role with ID: ${role.id}`,
                            });
                          }}
                          onRoleSelect={(role) => {
                            append({
                              role: "user",
                              content: `I want to update role in a project with ID: ${role.id}`,
                            });
                          }}
                          onRoleUpdateRequest={(role) => {
                            append({
                              role: "user",
                              content: `I want to update role with ID: ${role.id} with\nname: ${role.role}\ndescription: ${role.description}\nskills:\n-${role.skills.join(
                                "\n-"
                              )}`,
                            });
                          }}
                          onRoleReassignRequest={(role) => {
                            append({
                              role: "user",
                              content: `I want to reassign a role with ID: ${role.id} to another person`,
                            });
                          }}
                          onCandidateSelect={(roleId, candidate) => {
                            append({
                              role: "user",
                              content: `I want to reassign the role with ID: ${roleId} to the person below:\n- id: ${candidate.id}\n- name: ${candidate.name}\n- role: ${candidate.role}\n- avatar: ${candidate.avatar}\n- match: ${candidate.match}`,
                            });
                          }}
                          onCreateClick={openDialog}
                        />
                        <div className="mt-1" />
                      </>
                    ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="relative m-2">
        <InputTextarea
          ref={textAreaRef}
          id="message"
          autoComplete="off"
          rows={1}
          autoResize
          variant="filled"
          className={clsx(
            styles.inputTextarea,
            "rounded-3xl w-full overflow-y-auto border-none py-3 pl-6 pr-7 border border-gray-200 bg-white"
          )}
          placeholder="Ask Teemo anything..."
          value={input}
          onChange={(e) => {
            handleInputChange(e);
            adjustTextAreaHeight();
          }}
          onFocus={adjustTextAreaHeight}
          onKeyDown={onChatInputKeyDown}
        />
        <div className={clsx(styles.attachmentButton, "absolute")}>
          <Button
            icon="pi pi-paperclip"
            rounded
            text
            size="small"
            className={clsx("absolute", styles.attachmentButton)}
            severity="secondary"
          />
        </div>
        <div className={clsx(styles.chatButton, "absolute")}>
          <Button
            icon={clsx(
              "pi text-xs",
              isLoading ? "pi-spin pi-spinner" : "pi-send"
            )}
            rounded
            text
            size="small"
            disabled={isLoading || input.length === 0}
            onClick={handleSubmit}
            className={clsx("absolute", styles.chatButton)}
            severity="secondary"
          />
        </div>
      </div>
    </div>
  );
}

export default ChatDisplay;
