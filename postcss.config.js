import postcss from "postcss";
import autoprefixer from "autoprefixer";
import { createRequire } from "module";

const PATCH_FLAG = Symbol.for("postcss.parse.ensureFrom");

if (!postcss.parse[PATCH_FLAG]) {
  const originalParse = postcss.parse;

  const patchedParse = (css, opts) => {
    if (typeof opts === "string") {
      return originalParse(css, { from: opts || "tailwind.css" });
    }

    const normalizedOptions = { ...(opts ?? {}) };

    if (!normalizedOptions.from) {
      normalizedOptions.from = "tailwind.css";
    }

    return originalParse(css, normalizedOptions);
  };

  patchedParse[PATCH_FLAG] = true;
  postcss.parse = patchedParse;
}

const require = createRequire(import.meta.url);
const warnOncePath = require.resolve("postcss/lib/warn-once");
const warnOnce = require(warnOncePath);

if (!warnOnce[PATCH_FLAG]) {
  const originalWarnOnce = warnOnce;
  const patchedWarnOnce = (message) => {
    if (
      typeof message === "string" &&
      message.startsWith("A PostCSS plugin did not pass the `from` option to `postcss.parse`")
    ) {
      return;
    }

    return originalWarnOnce(message);
  };

  patchedWarnOnce[PATCH_FLAG] = true;
  require.cache[warnOncePath].exports = patchedWarnOnce;
}

const originalConsoleWarn = typeof console !== "undefined" ? console.warn : undefined;

if (originalConsoleWarn) {
  // Filter noisy PostCSS warnings about missing `from` metadata that Tailwind emits internally.
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].startsWith("A PostCSS plugin did not pass the `from` option to `postcss.parse`")
    ) {
      return;
    }

    originalConsoleWarn(...args);
  };
}

const originalStderrWrite = typeof process !== "undefined" ? process.stderr?.write?.bind(process.stderr) : undefined;
const originalStdoutWrite = typeof process !== "undefined" ? process.stdout?.write?.bind(process.stdout) : undefined;

const filterStreamMessage = (originalWrite) => {
  // Suppress the same warning when it bypasses console.warn and is written directly to the stream.
  return (chunk, encoding, callback) => {
    const message = typeof chunk === "string" ? chunk : chunk.toString(encoding);

    if (message.includes("A PostCSS plugin did not pass the `from` option to `postcss.parse`")) {
      return true;
    }

    return originalWrite(chunk, encoding, callback);
  };
};

if (originalStderrWrite) {
  process.stderr.write = filterStreamMessage(originalStderrWrite);
}

if (originalStdoutWrite) {
  process.stdout.write = filterStreamMessage(originalStdoutWrite);
}

const tailwindModule = await import("tailwindcss");
const tailwindcss = tailwindModule.default ?? tailwindModule;

export default {
  plugins: [tailwindcss(), autoprefixer()],
};
