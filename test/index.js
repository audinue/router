import { html } from "@audinue/html";
import { Router } from "../router";

const layout = (title, content) => html`
  <ul>
    <li>
      <a href="/not-found">Not Found Test</a>
    </li>
    <li>
      <a href="/error">Error Test</a>
    </li>
    <li>
      <a href="/login">Login</a>
    </li>
    <li>
      <a href="/login2">Login2</a>
    </li>
  </ul>
  <h1>${title}</h1>
  <div>${content}</div>
`;

Router()
  .get("/", () => {
    return layout(
      "Home",
      html`
        Home content here!
      `
    );
  })
  .get("/error", () => {
    throw new Error("Awesome!");
  })
  .all("/login", (req) => {
    if (req.method === "POST") {
      if (
        req.body.get("username") === "admin" &&
        req.body.get("password") === "admin"
      ) {
        return { location: "/login?ok" };
      } else {
        return { location: "/login?error" };
      }
    }
    return layout(
      "Login",
      html`
        ${req.url.searchParams.has("error") &&
        html`
          <p>Invalid username or password!</p>
        `}
        ${req.url.searchParams.has("ok") &&
        html`
          <p>Login OK</p>
        `}
        <form method="post">
          <p>
            Username
            <br />
            <input name="username" autofocus />
          </p>
          <p>
            Password
            <br />
            <input name="password" type="password" />
          </p>
          <p>
            <button>Login</button>
          </p>
        </form>
      `
    );
  })
  .get("/login2", (req) => {
    return layout(
      "Login2",
      html`
        ${req.url.searchParams.has("error") &&
        html`
          <p>Invalid username or password!</p>
        `}
        ${req.url.searchParams.has("ok") &&
        html`
          <p>Login OK</p>
        `}
        <form method="post" action="/login2">
          <p>
            Username
            <br />
            <input name="username" required autofocus />
          </p>
          <p>
            Password
            <br />
            <input name="password" type="password" required />
          </p>
          <p>
            <button>Login</button>
          </p>
        </form>
      `
    );
  })
  .post("/login2", (req) => {
    if (
      req.body.get("username") === "admin" &&
      req.body.get("password") === "admin"
    ) {
      return { location: "/login2?ok" };
    } else {
      return { location: "/login2?error" };
    }
  })
  .error((req) => {
    return layout(
      "Error",
      html`
        <pre>${req.error.stack}</pre>
      `
    );
  })
  .notFound((req) => {
    return layout(
      "Not Found",
      html`
        <p>The page you are looking for was not found.</p>
      `
    );
  })
  .start({
    reload: true
  });
