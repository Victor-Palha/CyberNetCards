import { useState, useEffect } from "react";

const ex = `#include <stdio.h>
#include <stdlib.h>
#include <libssh/libssh.h>

int main() {
\tssh_session my_ssh_session;
\tint verbosity = SSH_LOG_PROTOCOL;

\tmy_ssh_session = ssh_new();
\tif (my_ssh_session == NULL) {
\t\tfprintf(stderr, "Falha ao criar a sessão SSH.");
\t\texit(EXIT_FAILURE);
\t}
`;

export function CodeWriter() {
  const text = ex;
  const [code, setCode] = useState("");

  function writeCode(text: string, c = 0) {
    if (c < text.length) {
      setCode(text.slice(0, c + 1));

      setTimeout(() => {
        writeCode(text, c + 1);
      }, 35);
    }
  }

  useEffect(() => {
    writeCode(text);
  }, []);

  return (
      <code
        className="text-[14px] code-block cyber-glitch-2 opacity-80"
        data-title="CNT"
        style={{ whiteSpace: "pre-line" }}
      >
        {code}
      </code>
  );
}
