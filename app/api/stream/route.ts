import { subscribe } from "@/lib/sse";

export const dynamic = "force-dynamic";

export async function GET() {
  let unsub: () => void;

  const body = new ReadableStream({
    start(controller) {
      // Send heartbeat immediately so browser confirms connection
      controller.enqueue(new TextEncoder().encode(": heartbeat\n\n"));

      unsub = subscribe((data) => {
        try {
          controller.enqueue(new TextEncoder().encode(data));
        } catch {
          // client disconnected
        }
      });

      // Keepalive every 25s so proxies don't close the connection
      const hb = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(": heartbeat\n\n"));
        } catch {
          clearInterval(hb);
        }
      }, 25000);
    },
    cancel() {
      unsub?.();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
