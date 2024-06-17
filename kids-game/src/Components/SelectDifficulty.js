import React from "react";
import styled from "styled-components";
const SelectDifficulty = ({ handleChange, difficulty }) => {
  return (
    <Wrapper>
      <label>Difficulty: </label>
      <select
        name="difficulty"
        defaultValue={difficulty}
        onChange={handleChange}
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

export default SelectDifficulty;
