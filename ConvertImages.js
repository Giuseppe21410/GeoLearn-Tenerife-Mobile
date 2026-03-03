import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TARGET_DIRS = [
    path.join(__dirname, 'src'),
    path.join(__dirname, 'public')
];

const WEBP_CONFIG = {
    quality: 80,      
    effort: 6         
};
const getFiles = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let fileList = [];

    files.forEach((file) => {
        const res = path.join(dir, file.name);
        if (file.isDirectory()) {
            if (file.name !== 'node_modules' && file.name !== '.git' && file.name !== 'dist') {
                fileList = [...fileList, ...getFiles(res)];
            }
        } else {
            fileList.push(res);
        }
    });
    return fileList;
};

const convertImages = async () => {
    console.log("🚀 Iniciando conversión a WebP...");
    let totalSaved = 0;
    let count = 0;

    for (const dir of TARGET_DIRS) {
        if (!fs.existsSync(dir)) continue;

        const files = getFiles(dir);

        for (const filePath of files) {
            const ext = path.extname(filePath).toLowerCase();
            
            if (['.png', '.jpg', '.jpeg'].includes(ext)) {
                const newFilePath = filePath.replace(ext, '.webp');
                
                if (fs.existsSync(newFilePath)) {
                    continue;
                }

                try {
                    const originalSize = fs.statSync(filePath).size;

                    await sharp(filePath)
                        .webp(WEBP_CONFIG)
                        .toFile(newFilePath);

                    const newSize = fs.statSync(newFilePath).size;
                    const saved = originalSize - newSize;
                    totalSaved += saved;
                    count++;

                    console.log(`✅ Convertido: ${path.basename(filePath)} -> ${path.basename(newFilePath)}`);
                    console.log(`   📉 Ahorro: ${(saved / 1024).toFixed(2)} KB (${((saved/originalSize)*100).toFixed(0)}%)`);

                } catch (err) {
                    console.error(`❌ Error en ${path.basename(filePath)}:`, err.message);
                }
            }
        }
    }

    console.log("\n✨ --- RESUMEN FINAL ---");
    console.log(`🖼️  Imágenes convertidas: ${count}`);
    console.log(`💾 Espacio total ahorrado: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
    console.log("⚠️  IMPORTANTE: Ahora debes actualizar tus 'import' y borrar los archivos antiguos manualmente.");
};

convertImages();