import { NextRequest, NextResponse } from "next/server";
import puppeteerCore from "puppeteer-core";
import puppeteer, { Browser } from "puppeteer";
import chromium from "@sparticuz/chromium";

export const dynamic = "force-dynamic";

async function getBrowser(): Promise<Browser> {
  if (process.env.VERCEL_ENV === "production") {
    const executablePath = await chromium.executablePath();

    const browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
    return browser as unknown as Browser;
  } else {
    const browser = await puppeteer.launch();
    return browser;
  }
}

export async function GET(request: NextRequest) {
  const browser = await getBrowser();

  const page = await browser.newPage();
  await page.goto("https://example.com");

  const { title, h1 } = await page.evaluate(() => {
    const title = document.querySelector("title");
    const h1 = document.querySelector("h1");

    return { title: title?.innerText, h1: h1?.innerHTML };
  });

  console.log(title);

  await browser.close();
  return new NextResponse(`Title: ${title}, Header: ${h1}`);
}
