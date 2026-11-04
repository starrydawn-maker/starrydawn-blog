// 把 Cloudflare 返回的英文地区名映射成中国省级行政区全称（与 DataV 地图数据匹配）
const REGION_MAP = {
	Beijing: "北京市",
	Shanghai: "上海市",
	Tianjin: "天津市",
	Chongqing: "重庆市",
	Anhui: "安徽省",
	Fujian: "福建省",
	Gansu: "甘肃省",
	Guangdong: "广东省",
	Guizhou: "贵州省",
	Hainan: "海南省",
	Hebei: "河北省",
	Heilongjiang: "黑龙江省",
	Henan: "河南省",
	Hubei: "湖北省",
	Hunan: "湖南省",
	Jiangsu: "江苏省",
	Jiangxi: "江西省",
	Jilin: "吉林省",
	Liaoning: "辽宁省",
	Qinghai: "青海省",
	Shaanxi: "陕西省",
	Shandong: "山东省",
	Shanxi: "山西省",
	Sichuan: "四川省",
	Yunnan: "云南省",
	Zhejiang: "浙江省",
	Taiwan: "台湾省",
	Guangxi: "广西壮族自治区",
	"Inner Mongolia": "内蒙古自治区",
	Ningxia: "宁夏回族自治区",
	Tibet: "西藏自治区",
	Xinjiang: "新疆维吾尔自治区",
	"Hong Kong": "香港特别行政区",
	Macau: "澳门特别行政区",
	Macao: "澳门特别行政区",
};

function toRegionName(raw) {
	if (!raw) return "未知";
	const name = raw.trim();
	return REGION_MAP[name] || name;
}

export async function onRequestPost({ request, env }) {
	const cf = request.cf || {};
	const country = cf.country || "XX";
	const region = toRegionName(cf.region);
	const key = `visitor:${country}:${region}`;
	const current = Number((await env.KV.get(key)) || 0);
	await env.KV.put(key, String(current + 1));
	return Response.json({ ok: true });
}
