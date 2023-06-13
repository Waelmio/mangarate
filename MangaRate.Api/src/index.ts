import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import config from 'config';
import morgan from 'morgan';
import express from 'express';
import { Logger } from 'tslog';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { init } from "./Services/init";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./common/ErrorHandler";
import * as swaggerJson from "../build/swagger.json";

const log: Logger = new Logger();

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
    const angularAppPath = path.join(__dirname, '../dist/manga-rate.ui/');
    app.use(express.static(angularAppPath));
    
    app.get('*', function(_req: any, res: { sendFile: (arg0: string) => void; }) {
        res.sendFile(path.join(angularAppPath, 'index.html'));
    });

    /**
     * Server Activation
     */
    app.listen(PORT, () => {
        log.info(`Server running on http://localhost:${PORT}`);
    });
}

main();
