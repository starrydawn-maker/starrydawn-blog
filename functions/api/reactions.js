const EMOJIS = ["👍", "❤️", "🎉", "👀", "😮", "😢"];

export async function onRequestGet({ request, env }) {
	const url = new URL(request.url);
	const slug = url.searchParams.get("slug") || "";
	const counts = {};
	for (const emoji of EMOJIS) {
		const val = await env.KV.get(`reaction:${slug}:${emoji}`);
		counts[emoji] = val ? Number(val) : 0;
	}
	return Response.json(counts);
}

export async function onRequestPost({ request, env }) {
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({ ok: false, error: "bad request" }, { status: 400 });
	}
	const slug = String(body.slug || "");
	const emoji = String(body.emoji || "");
	if (!slug || !EMOJIS.includes(emoji)) {
		return Response.json({ ok: false, error: "invalid" }, { status: 400 });
	}
	const key = `reaction:${slug}:${emoji}`;
	const current = Number((await env.KV.get(key)) || 0);
	const next = current + 1;
	await env.KV.put(key, String(next));
	return Response.json({ ok: true, count: next });
}
