import { useEffect, useState } from "react";
import { Page, getData } from "./getData";
import { RenderPages } from "./RenderPages";

const promise = getData();

export function App() {
  const [value, setValue] = useState<Page[] | undefined>(undefined);
  const [resolved, setResolved] = useState(false);
  
  useEffect(() => {
    promise.then(setValue);
    setResolved(true);
  }, []);

  if (resolved && !!value) {
    return <RenderPages pages={value} />
  } else {
    return null;
  }
}