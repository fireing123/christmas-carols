import YoutubeBox from "../YoutubeBox";
import classes from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={classes.footer}>
           <YoutubeBox />
        </footer>
    );
}