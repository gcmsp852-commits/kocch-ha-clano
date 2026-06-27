const fs = require('fs');
let html = fs.readFileSync('QR Twin Generator(Ver1.6) .html', 'utf8');

// Function to replace by finding exact token sequences to ignore whitespace differences
function replaceLoose(source, oldStr, newStr) {
  // Create a regex from oldStr that allows arbitrary whitespace
  const escaped = oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regexStr = escaped.replace(/\s+/g, '\\s+');
  const regex = new RegExp(regexStr);
  if (!regex.test(source)) {
    console.error("FAILED to find:\\n" + oldStr.substring(0, 50) + "...");
    return source;
  }
  return source.replace(regex, newStr);
}

const drawAddonOld = `function drawAddonAModeImage(ctx, areaX, areaY, areaW, areaH, cellPx) {
  const appEnc = $("appEncMode").checked;
  const sysEnc = $("sysEncMode").checked;
  const false = false;
  const digitalSign = $("digitalSignMode").checked;

  if (!appEnc && !sysEnc && !digitalSign) return false;

  if (false) {
    // 二重暗号化: 二重暗号化.png を領域内最大で表示 (幅を合わせる)
    const img = addonAImages['false'];
    if (!isImgReady(img)) return false;
    const scale = areaW / img.width;
    const dw = areaW;
    const dh = img.height * scale;
    const dx = areaX;
    const dy = areaY + (areaH - dh) / 2; // 上下中央揃え
    ctx.drawImage(img, dx, dy, dw, dh);
    return true;
  } else if (digitalSign) {
    // 電子署名: 暗号化.png + 1セル右に 電子署名.png
    const imgEnc = addonAImages['encrypt'];
    const imgSign = addonAImages['digitalSign'];
    if (!isImgReady(imgEnc) || !isImgReady(imgSign)) return false;
    // 暗号化.png: 取っ手以外の本体(正方形)を幅合わせ
    const scaleEnc = areaW / imgEnc.width;
    const drawEncW = areaW;
    const drawEncH = imgEnc.height * scaleEnc;
    const handleDrawH = drawEncH - areaW; // 本体はareaW x areaWとみなす
    const encDx = areaX;
    const encDy = areaY - handleDrawH;
    ctx.drawImage(imgEnc, encDx, encDy, drawEncW, drawEncH);
    // 電子署名.png: 暗号化.pngの1セル右に配置
    const scaleSign = areaW / imgSign.width;
    const drawSignW = areaW;
    const drawSignH = imgSign.height * scaleSign;
    const signDx = areaX + areaW + cellPx * 1;
    const signDy = areaY + (areaH - drawSignH) / 2;
    ctx.drawImage(imgSign, signDx, signDy, drawSignW, drawSignH);
    return true;
  } else if (appEnc || sysEnc) {
    // 暗号化: 暗号化.png 取っ手以外の本体を幅合わせ
    const img = addonAImages['encrypt'];
    if (!isImgReady(img)) return false;
    const scale = areaW / img.width;
    const dw = areaW;
    const dh = img.height * scale;
    const handleDrawH = dh - areaW;
    const dx = areaX;
    const dy = areaY - handleDrawH;
    ctx.drawImage(img, dx, dy, dw, dh);
    return true;
  }
  return false;
}`;

const drawAddonNew = `function drawAddonAModeImage(ctx, areaX, areaY, areaW, areaH, cellPx) {
  const appEnc = $("appEncMode").checked;
  const sysEnc = $("sysEncMode").checked;
  const false = false;
  const digitalSign = $("digitalSignMode").checked;
  const sameData = $("sameDataFlag").checked;

  if (!appEnc && !sysEnc && !digitalSign && !sameData) return false;

  if (sameData) {
    // 同一データ: 二重暗号化.png を領域内最大で表示 (幅を合わせる)
    const img = addonAImages['false'];
    if (!isImgReady(img)) return false;
    const scale = areaW / img.width;
    const dw = areaW;
    const dh = img.height * scale;
    const dx = areaX;
    const dy = areaY + (areaH - dh) / 2; // 上下中央揃え
    ctx.drawImage(img, dx, dy, dw, dh);
    return true;
  } else if (digitalSign) {
    // 電子署名: 暗号化.png + 1セル右に 電子署名.png
    const imgEnc = addonAImages['encrypt'];
    const imgSign = addonAImages['digitalSign'];
    if (!isImgReady(imgEnc) || !isImgReady(imgSign)) return false;
    // 暗号化.png: 取っ手以外の本体(正方形)を幅合わせ
    const scaleEnc = areaW / imgEnc.width;
    const drawEncW = areaW;
    const drawEncH = imgEnc.height * scaleEnc;
    const handleDrawH = drawEncH - areaW; // 本体はareaW x areaWとみなす
    const encDx = areaX;
    const encDy = areaY - handleDrawH;
    ctx.drawImage(imgEnc, encDx, encDy, drawEncW, drawEncH);
    // 電子署名.png: 暗号化.pngの1セル右に配置
    const scaleSign = areaW / imgSign.width;
    const drawSignW = areaW;
    const drawSignH = imgSign.height * scaleSign;
    const signDx = areaX + areaW + cellPx * 1;
    const signDy = areaY + (areaH - drawSignH) / 2;
    ctx.drawImage(imgSign, signDx, signDy, drawSignW, drawSignH);
    return true;
  } else if (appEnc || sysEnc ) {
    // 暗号化・二重暗号化: 暗号化.png 取っ手以外の本体を幅合わせ
    const img = addonAImages['encrypt'];
    if (!isImgReady(img)) return false;
    const scale = areaW / img.width;
    const dw = areaW;
    const dh = img.height * scale;
    const handleDrawH = dh - areaW;
    const dx = areaX;
    const dy = areaY - handleDrawH;
    ctx.drawImage(img, dx, dy, dw, dh);
    return true;
  }
  return false;
}`;

html = replaceLoose(html, drawAddonOld, drawAddonNew);

const padTwinOld = `{
    const addonCellSize = 7 * cellPx;
    const appEnc = $("appEncMode").checked;
    const sysEnc = $("sysEncMode").checked;
    const false = false;
    const digitalSign = $("digitalSignMode").checked;
    // 付加領域A: 暗号化.pngの取っ手がはみ出す分
    if ((appEnc || sysEnc || digitalSign) && isImgReady(addonAImages['encrypt'])) {
      const img = addonAImages['encrypt'];
      const scale = addonCellSize / img.width;
      const handleDrawH = (img.height * scale) - addonCellSize;
      extraTopPad = Math.ceil(handleDrawH);
    }
    // 付加領域A: 電子署名の右はみ出し分（暗号化.png + 1セル間隔 + 電子署名.png幅）
    if (digitalSign && isImgReady(addonAImages['digitalSign'])) {
      const imgSign = addonAImages['digitalSign'];
      const scaleSign = addonCellSize / imgSign.width;
      const sdw = imgSign.width * scaleSign;
      extraRightPad = Math.max(extraRightPad, Math.ceil(cellPx * 1 + sdw));
    }`;

const padTwinNew = `{
    const addonCellSize = 7 * cellPx;
    const appEnc = $("appEncMode").checked;
    const sysEnc = $("sysEncMode").checked;
    const false = false;
    const digitalSign = $("digitalSignMode").checked;
    const sameData = $("sameDataFlag").checked;
    // 付加領域A: 暗号化.pngの取っ手がはみ出す分
    if ((appEnc || sysEnc  || digitalSign) && !sameData && isImgReady(addonAImages['encrypt'])) {
      const img = addonAImages['encrypt'];
      const scale = addonCellSize / img.width;
      const handleDrawH = (img.height * scale) - addonCellSize;
      extraTopPad = Math.ceil(handleDrawH);
    }
    // 付加領域A: 電子署名の右はみ出し分（暗号化.png + 1セル間隔 + 電子署名.png幅）
    if (digitalSign && !sameData && isImgReady(addonAImages['digitalSign'])) {
      const imgSign = addonAImages['digitalSign'];
      const scaleSign = addonCellSize / imgSign.width;
      const sdw = imgSign.width * scaleSign;
      extraRightPad = Math.max(extraRightPad, Math.ceil(cellPx * 1 + sdw));
    }`;

html = replaceLoose(html, padTwinOld, padTwinNew);

const padColorOld = `const addonCellSize = 7 * cellPx;
    const appEnc = $("appEncMode").checked;
    const sysEnc = $("sysEncMode").checked;
    const digitalSign = $("digitalSignMode").checked;
    if ((appEnc || sysEnc || digitalSign) && isImgReady(addonAImages['encrypt'])) {
      const img = addonAImages['encrypt'];
      const scale = addonCellSize / img.width;
      const handleDrawH = (img.height * scale) - addonCellSize;
      cExtraTopPad = Math.ceil(handleDrawH);
    }
    if (digitalSign && isImgReady(addonAImages['digitalSign'])) {
      const imgSign = addonAImages['digitalSign'];
      const scaleSign = addonCellSize / imgSign.width;
      const sdw = imgSign.width * scaleSign;
      cExtraRightPad = Math.max(cExtraRightPad, Math.ceil(cellPx * 1 + sdw));
    }`;

const padColorNew = `const addonCellSize = 7 * cellPx;
    const appEnc = $("appEncMode").checked;
    const sysEnc = $("sysEncMode").checked;
    const false = false;
    const digitalSign = $("digitalSignMode").checked;
    const sameData = $("sameDataFlag").checked;
    if ((appEnc || sysEnc  || digitalSign) && !sameData && isImgReady(addonAImages['encrypt'])) {
      const img = addonAImages['encrypt'];
      const scale = addonCellSize / img.width;
      const handleDrawH = (img.height * scale) - addonCellSize;
      cExtraTopPad = Math.ceil(handleDrawH);
    }
    if (digitalSign && !sameData && isImgReady(addonAImages['digitalSign'])) {
      const imgSign = addonAImages['digitalSign'];
      const scaleSign = addonCellSize / imgSign.width;
      const sdw = imgSign.width * scaleSign;
      cExtraRightPad = Math.max(cExtraRightPad, Math.ceil(cellPx * 1 + sdw));
    }`;

html = replaceLoose(html, padColorOld, padColorNew);

fs.writeFileSync('QR Twin Generator(Ver1.6) .html', html);
console.log('Fixed via space-tolerant index search in javascript object string');
