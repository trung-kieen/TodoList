package com.example.todolist.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class LabelRequest{
  @NotBlank
  @Size(max = 40)
  private String name;

  @NotBlank
  @Size(max = 7, min = 7) // Hex code have 7 digit #123456
  private String color;


  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setColor(String color) {
    this.color = color;
  }

  public String getColor() {
    return color;
  }


}
