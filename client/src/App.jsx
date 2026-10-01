import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import axios from "axios";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Hey Team! 👋</h1>
          <p>
            This is a simple web app that showcases an API made with{" "}
            <code>go</code> and <code>node</code> .
          </p>
        </div>
      </section>

      <div className="ticks">
        <CurrentTime api="/api/golang/" />
      </div>

      <div className="ticks">
        <CurrentTime api="/api/node/" />
      </div>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </QueryClientProvider>
  );
}

const CurrentTime = ({ api }) => {
  const { isPending, error, data } = useQuery({
    queryKey: [api],
    queryFn: () => axios.get(api).then((res) => res.data),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <section id="next-steps">
      <div id="docs">
        <h2>
          API: <code>{data.api}</code>
        </h2>
        <p>Time from DB: {data.now}</p>
      </div>
    </section>
  );
};
