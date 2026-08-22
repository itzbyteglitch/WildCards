import JSZip from "jszip";
import DOMPurify from "dompurify";
import type { EmbedPptDeck } from "./types";
import { makeId } from "./storage";

const EMU = 914400;
const parser = () => new DOMParser();
const ns = "*|";
function esc(s = "") {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );
}
function text(el: Element, sel: string) {
  return el.querySelector(sel)?.textContent || "";
}
function attr(el: Element | null, name: string) {
  return el?.getAttribute(name) || "";
}
function px(n: string | null | undefined, scale: number) {
  return (Number(n || 0) / EMU) * 96 * scale;
}
function color(s?: string) {
  return s ? `#${s}` : "transparent";
}
function safeUrl(url: string) {
  return /^(https?:|mailto:|tel:|#|\/)/i.test(url) ? url : "#";
}
async function fileText(zip: JSZip, path: string) {
  return (await zip.file(path)?.async("text")) || "";
}
function relMap(xml: string) {
  const map = new Map<string, string>();
  if (!xml) return map;
  const doc = parser().parseFromString(xml, "application/xml");
  doc
    .querySelectorAll("Relationship")
    .forEach((r) => map.set(attr(r, "Id"), attr(r, "Target")));
  return map;
}
function pos(node: Element, scale: number) {
  const off = node.querySelector(`${ns}off`),
    ext = node.querySelector(`${ns}ext`);
  return {
    x: px(attr(off, "x"), scale),
    y: px(attr(off, "y"), scale),
    w: px(attr(ext, "cx"), scale),
    h: px(attr(ext, "cy"), scale),
  };
}
function shapeText(sp: Element) {
  return Array.from(sp.querySelectorAll(`${ns}p`))
    .map((p) =>
      Array.from(p.querySelectorAll(`${ns}t`))
        .map((t) => t.textContent || "")
        .join(""),
    )
    .filter(Boolean)
    .join("<br/>");
}
function runStyle(sp: Element) {
  const rPr = sp.querySelector(`${ns}rPr`);
  const size = Number(attr(rPr || null, "sz") || 1800) / 100;
  const fill = rPr?.querySelector(`${ns}solidFill ${ns}srgbClr`);
  return {
    fontSize: Math.max(8, size),
    fill: color(attr(fill || null, "val") || "1f2937"),
  };
}
function shapeFill(sp: Element) {
  const fill = sp.querySelector(`${ns}spPr ${ns}solidFill ${ns}srgbClr`);
  return fill ? color(attr(fill || null, "val")) : "transparent";
}
function lineColor(sp: Element) {
  const ln = sp.querySelector(`${ns}ln ${ns}solidFill ${ns}srgbClr`);
  return ln ? color(attr(ln, "val")) : "#94a3b8";
}
async function mediaData(zip: JSZip, target: string) {
  const clean = target.replace(/^\.\.\//, "ppt/");
  const f = zip.file(clean);
  if (!f) return "";
  const blob = await f.async("blob");
  return await new Promise<string>((res) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result));
    fr.readAsDataURL(blob);
  });
}

export async function convertPptx(file: File): Promise<EmbedPptDeck> {
  if (!file.name.toLowerCase().endsWith(".pptx"))
    throw new Error("Please upload a .pptx file.");
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const presXml = await fileText(zip, "ppt/presentation.xml");
  if (!presXml)
    throw new Error("This file does not look like a valid PPTX presentation.");
  const pres = parser().parseFromString(presXml, "application/xml");
  const sldSz = pres.querySelector(`${ns}sldSz`);
  const width = px(attr(sldSz, "cx") || String(13.333 * EMU), 1);
  const height = px(attr(sldSz, "cy") || String(7.5 * EMU), 1);
  const rels = relMap(await fileText(zip, "ppt/_rels/presentation.xml.rels"));
  const slideIds = Array.from(pres.querySelectorAll(`${ns}sldId`))
    .map((s) => rels.get(attr(s, "r:id")))
    .filter(Boolean) as string[];
  const warnings: string[] = [];
  const slides = [];
  for (let i = 0; i < slideIds.length; i++) {
    const path = slideIds[i]
      .replace(/^\.\//, "ppt/")
      .replace(/^slides\//, "ppt/slides/");
    const xml = await fileText(zip, path);
    const doc = parser().parseFromString(xml, "application/xml");
    const slideRels = relMap(
      await fileText(
        zip,
        path.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels",
      ),
    );
    const parts: string[] = [];
    const bg = doc.querySelector(`${ns}bg ${ns}srgbClr`);
    parts.push(
      `<div class="ep-slide-bg" style="background:${bg ? color(attr(bg, "val")) : "#fff"}"></div>`,
    );
    for (const pic of Array.from(doc.querySelectorAll(`${ns}pic`))) {
      const p = pos(pic, 1);
      const rid = attr(pic.querySelector(`${ns}blip`), "r:embed");
      const data = rid ? await mediaData(zip, slideRels.get(rid) || "") : "";
      if (data)
        parts.push(
          `<img src="${data}" style="position:absolute;left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;object-fit:contain" alt="Slide image"/>`,
        );
    }
    for (const sp of Array.from(doc.querySelectorAll(`${ns}sp`))) {
      const p = pos(sp, 1);
      const body = shapeText(sp);
      const st = runStyle(sp);
      const fill = shapeFill(sp);
      const border = lineColor(sp);
      const isLine = attr(sp.querySelector(`${ns}prstGeom`), "prst") === "line";
      if (isLine) {
        parts.push(
          `<div style="position:absolute;left:${p.x}px;top:${p.y}px;width:${p.w}px;border-top:2px solid ${border};transform-origin:left top"></div>`,
        );
      } else {
        parts.push(
          `<div style="position:absolute;box-sizing:border-box;overflow:hidden;left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px;padding:6px;background:${fill};border:${fill === "transparent" ? "0" : "1px solid " + border};color:${st.fill};font-size:${st.fontSize}px;line-height:1.2;white-space:pre-wrap">${esc(body)}</div>`,
        );
      }
    }
    if (doc.querySelector(`${ns}graphicFrame`)) {
      warnings.push(
        `Slide ${i + 1}: tables/charts/SmartArt may be simplified or omitted.`,
      );
    }
    const clean = DOMPurify.sanitize(parts.join(""), {
      ADD_TAGS: ["svg"],
      ADD_ATTR: ["style", "src", "alt"],
    });
    slides.push({
      id: `slide-${i + 1}`,
      index: i + 1,
      width,
      height,
      html: clean,
      warnings: [],
    });
  }
  if (!slides.length) throw new Error("No slides were found in the PPTX.");
  return {
    id: makeId(),
    title: file.name.replace(/\.pptx$/i, ""),
    sourceName: file.name,
    createdAt: new Date().toISOString(),
    width,
    height,
    slides,
    warnings,
  };
}
