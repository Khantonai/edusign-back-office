import { ImgHTMLAttributes } from 'react';


export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img {...props} src="/icon.png" alt="" style={{width: "100%", height: "100%"}} />
    );
}
