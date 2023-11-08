import React, { useState } from "react";
import "./App.css";
import { BeatLoader } from "react-spinners";
import { FiCopy } from "react-icons/fi";
import { HiSpeakerWave } from "react-icons/hi2"; // Added import for HiSpeakerWave
import Languages from "./Languages";
import axios from "axios";

const App = () => {
  const [language, setLanguage] = useState("Afrikaans");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [translation, setTranslation] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setLanguage(e.target.value);
    setError("");
  };

  const translate = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/get-translation?language=${language}&message=${message}`
      );

      const translatedText =
        response.data?.translation ||
        response.data ||
        "Translation not available";

      const correctedText = response.data?.corrected_sentence;

      setTranslation(translatedText);
      setCorrectedText(correctedText);
    } catch (error) {
      console.error("Error translating:", error);
      setError("Error occurred while translating. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!message) {
      setError("Please enter the message.");
      return;
    }
    translate();
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(translation)
      .then(() => displayNotification())
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const displayNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const speakTranslation = async () => {
    const response = await axios.get(
      `/get-translation-speech?translation=${translation}`
    );
    console.log(response.data);
  }

  return (
    <div className="container">
      <h1>Translation</h1>
      <p>Powered by OpenAI</p>

      <Languages handleInputChange={handleInputChange} />

      <form onSubmit={handleOnSubmit}>
        <textarea
          name="message"
          placeholder="Type your message here.."
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        {error && <div className="error">{error}</div>}

        <button type="submit">Translate</button>
      </form>

      <div className="translation">
        {isLoading ? <BeatLoader size={12} color={"red"} /> : translation}
        {translation ? (
          <div className="translation-handle-buttons">
            <HiSpeakerWave className="speaker-button" onClick={speakTranslation}/>
            <FiCopy className="copy-button" onClick={handleCopy} />
          </div>
        ) : (
          ""
        )}
      </div>

      {correctedText ? (
          <div className="corrected_text">
            <p>
              Correction:{" "}
              <span className="corrected-sentence">{correctedText}</span>
            </p>
          </div>
        ) : (
          ""
        )}

      <div className={`notification ${showNotification ? "active" : ""}`}>
        Copied to clipboard!
      </div>
    </div>
  );
};

export default App;
