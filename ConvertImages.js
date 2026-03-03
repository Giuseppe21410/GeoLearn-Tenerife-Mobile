import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Carpetas donde buscar imágenes (Ajusta si tienes más)
const TARGET_DIRS = [
    path.join(__dirname, 'src'),
    path.join(__dirname, 'public')
];

// Configuración de calidad WebP
const WEBP_CONFIG = {
    quality: 80,      // Calidad visual (0-100)
    effort: 6         // Esfuerzo de compresión (0-6, más alto = mejor compresión pero más lento)
};

// Función para explorar carpetas recursivamente
const getFiles = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let fileList = [];

    files.forEach((file) => {
        const res = path.join(dir, file.name);
        if (file.isDirectory()) {
            // Ignorar carpeta node_modules, .git o dist por si acaso
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
            
            // Solo procesar PNG y JPG/JPEG
            if (['.png', '.jpg', '.jpeg'].includes(ext)) {
                const newFilePath = filePath.replace(ext, '.webp');
                
                // Si ya existe el webp, saltar (o sobrescribir si prefieres)
                if (fs.existsSync(newFilePath)) {
                    continue;
                }

                try {
                    const originalSize = fs.statSync(filePath).size;

                    // Conversión
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