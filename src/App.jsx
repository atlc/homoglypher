import React, { useState } from "react";
import Swal from "sweetalert2";
import { homoglyphs } from "./letters";

/**
 * Built utilizing the homoglyph library compiled here
 * https://github.com/codebox/homoglyph/blob/master/raw_data/chars.txt
 */

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
});

const App = () => {
    const [rawText, setRawText] = useState("");
    const [glyphs, setGlyphs] = useState("");

    const handleTextUpdate = e => {
        const raw = e.target.value;
        setRawText(raw);

        const glyphed = raw
            .split("")
            .map(char => {
                const substitutes = homoglyphs[char];
                if (substitutes) {
                    const random_sub = substitutes[Math.floor(Math.random() * substitutes.length)];
                    return random_sub;
                } else {
                    return char;
                }
            })
            .join("");
        setGlyphs(glyphed);
    };

    const copy = async () => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(glyphs);

                Toast.fire({ title: "Successfully copied to your clipboard!" });
            }
        } catch (e) {
            Swal.fire({
                title: "Unable to copy automatically to your clipboard!",
                icon: "error",
                text: glyphs
            });
        }
    };

    return (
        <div className="container">
            <div className="mt-5 justify-content-center">
                <form className="p-5 bg-light rounded-3 shadow-lg">
                    <div className="row">
                        <div onClick={copy} className="col-12 col-md-6">
                            <label htmlFor="" className="text-dark">
                                Output (click to copy)
                            </label>
                            <textarea
                                value={glyphs}
                                style={{ resize: "none" }}
                                cols="30"
                                rows="10"
                                readOnly
                                className="form-control"></textarea>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="row">
                                <label className="text-dark">Input your text here:</label>
                            </div>
                            <div className="row">
                                <textarea
                                    value={rawText}
                                    onChange={handleTextUpdate}
                                    style={{ resize: "none" }}
                                    placeholder="Input your text to convert it to a mix of unicode characters to avoid simple word recognition."
                                    cols="30"
                                    rows="10"
                                    className="form-control"></textarea>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default App;
