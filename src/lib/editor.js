import {
  getHighlightOffset,
} from "./parser";
import styles from "../components/App/App.module.scss";

export class Highlighter {
  constructor(editor) {
    this.editor = editor;
    this.markers = [];
  }
  clear() {
    this.markers.forEach(marker => marker.clear());
  }
  mark(start, end, code) {
    this.markers.push(
      this.editor.doc.markText(
        getHighlightOffset(start, code),
        getHighlightOffset(end, code),
        { className: `${styles.blinkingBackground} has-background-grey-dark` }
      )
    );
  }
}
