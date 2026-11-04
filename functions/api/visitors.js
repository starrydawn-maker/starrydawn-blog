export async function onRequestGet({ env }) {
	const list = await env.KV.list({ prefix: "visitor:" });
	const data = {};
	for (const item of list.keys) {
		const parts = item.name.split(":");
		const region = parts[2] || "未知";
		const count = Number((await env.KV.get(item.name)) || 0);
		data[region] = (data[region] || 0) + count;
	}
	return Response.json(data);
}
