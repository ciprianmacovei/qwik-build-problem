import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      {head.meta.map((m, index: number) => (
        <meta {...m} key={"headmeta" + index} />
      ))}

      {head.links.map((l, index: number) => (
        <link {...l} key={"headlink" + index} />
      ))}

      {head.styles.map((s, index: number) => (
        <style
          {...s.props}
          dangerouslySetInnerHTML={s.style}
          key={"headstyles" + index}
        />
      ))}
    </>
  );
});
