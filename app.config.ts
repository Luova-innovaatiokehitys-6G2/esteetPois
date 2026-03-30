import { ExpoConfig, ConfigContext } from '@expo/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    slug: "esteetPois",
    name: "esteetPois",
    plugins: [
        [
            "@badatgil/expo-mapbox-navigation",
            {
                "accessToken": process.env.MAPBOX_KEY,
            }
        ],
    ]
});