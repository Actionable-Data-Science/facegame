class DataCollector {
  _image;
  _imageCropped;
  _imageCroppedMasked;
  _actionUnits;
  _userId;
  _dataCollectionAllowed;
  _willShare;
  _endpoint;
  _targetImageId;

  constructor() {
    this.prepare();
  }

  async prepare() {
    try {
      this._userId = await this.checkUserId();
      this._endpoint = "/api/add_gameplay_image/" + this._userId.toString();
      const allowed = await this.checkCollectionAllowed();
      this._willShare = allowed;
      this._dataCollectionAllowed = allowed;
    } catch (error) {
      console.error("Failed to prepare DataCollector:", error);
    }
  }

  async checkUserId() {
    try {
      const response = await fetch("/api/get_current_user_id");
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error("Failed to get user ID:", error);
      throw error;
    }
  }

  async checkCollectionAllowed() {
    try {
      const response = await fetch("/api/get_data_collection_allowed");
      const data = await response.json();
      return data.allowed;
    } catch (error) {
      console.error("Failed to check data collection allowed:", error);
      throw error;
    }
  }

  async uploadCollectedData() {
    try {
      await this.prepare(); // Ensure prepare method is called before uploading data

      if (this._willShare !== true) {
        console.log("Data sharing is not enabled. Skipping data upload.");
        return null;
      }

      // Rest of the uploadCollectedData method
      // ...
    } catch (error) {
      console.error("Failed to upload collected data:", error);
      throw error;
    }
  }

  uploadCollectedData = async () => {
    try {
      await this.prepare(); // Ensure prepare method is called before uploading data

      if (this._willShare !== true) {
        console.log("Data sharing is not enabled. Skipping data upload.");
        return null;
      }

      const formData = new FormData();
      formData.append("targetImageId", this._targetImageId);
      formData.append("actionUnits", JSON.stringify(this._actionUnits));
      formData.append("image", this._image.src);
      formData.append("imageCroppedMasked", this._imageCroppedMasked);

      const response = await fetch(this._endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to upload collected data:", error);
      throw error;
    }
  };

  setTargetImageId(targetImageId) {
    this._targetImageId = targetImageId;
  }

  setImage(image) {
    this._image = image;
  }

  setImageCropped(imageCropped) {
    this._imageCropped = imageCropped;
  }

  setImageCroppedMasked(imageCroppedMasked) {
    this._imageCroppedMasked = imageCroppedMasked;
  }

  setActionUnits(actionUnits) {
    this._actionUnits = actionUnits;
  }
}
