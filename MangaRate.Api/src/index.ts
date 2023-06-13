import config from 'config';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { init } from "./Services/init";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./common/ErrorHandler";
import * as swaggerJson from "../build/swagger.json";
import { RegisterRoutes } from "../build/routes";
import path from 'path';

async function main() {
    /**
    * App Variables
    */
    if (!config.has("server.port")) {
        process.exit(1);
    }

    await init();

    const PORT: number = config.get("server.port");

    const app = express();

    /**
     *  App Configuration
     */
    app.use(helmet());
    app.use(cors());

    // tsoa
    app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );
    app.use(bodyParser.json());
    RegisterRoutes(app);

    // Logging
    app.use(morgan("tiny"));

    // Swagger Setup
    app.use(express.static("public"));
    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerJson)
    );

    app.use(errorHandler);

    // // Angular Setup
    app.use(express.static(path.join(__dirname, '../dist/manga-rate.ui/')));
    
    app.get('*', function(_req: any, res: { sendFile: (arg0: string) => void; }) {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });

    /**
     * Server Activation
     */
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

main();
