import sys
import cv2
import os
import skimage
import numpy as np
import math
import dlib
import joblib
from scipy.spatial import ConvexHull
from skimage.morphology.convex_hull import grid_points_in_poly
from skimage.feature import hog
from base64 import b64decode
from dotenv import load_dotenv

load_dotenv()

predictor = dlib.shape_predictor("./resources/shape_predictor_68_face_landmarks.dat")
pca_model = joblib.load("./resources/hog_pca_all_emotio.joblib")
classifier = joblib.load("./resources/svm_568.joblib")
scaler = joblib.load("./resources/hog_scalar_aus.joblib")

FACES_FOLDER_PATH = os.environ["FACES_FOLDER_PATH"]

def calculate_action_units_from_image_url(image_url):
    """Returns list of action units for image with filepath image_url"""
    return calculate_action_units(cv2.imread(image_url))

def calculate_action_units_from_base_64_image(base64image):
    """Returns list of action units for base64 encoded image"""
    def readb64(uri):
        encoded_data = uri.split(',')[1]
        nparr = np.fromstring(b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    return calculate_action_units(readb64(base64image))

def calculate_action_units(image): 
    # Helper Functions

    detector = dlib.get_frontal_face_detector() # moved here, performance hit 100ms, segmentation fault prevented

    def shape_to_np(shape, dtype="int"):
        coords = np.zeros((68, 2), dtype=dtype)
        for i in range(0, 68):
            coords[i] = (shape.part(i).x, shape.part(i).y)
        return coords

    def bounding_box_naive(points):
        """returns a list containing the bottom left and the top right 
        points in the sequence
        Here, we use min and max four times over the collection of points
        """
        top_left_x = min(point[0] for point in points)
        top_left_y = min(point[1] for point in points)
        bot_right_x = max(point[0] for point in points)
        bot_right_y = max(point[1] for point in points)

        return [(top_left_x, top_left_y), (bot_right_x, bot_right_y)]

    def getNewCoords(point_x,point_y,upperleftX, upperleftY, lowerrightX, lowerRightY, image_width,image_height):

        sizeX = lowerrightX - upperleftX
        sizeY =  lowerRightY - upperleftY
        centerX = (lowerrightX + upperleftX)/2
        centerY = (lowerRightY + upperleftY)/2
        offsetX = (centerX-sizeX/2)*image_width/sizeX
        offsetY = (centerY-sizeY/2)*image_height/sizeY
        point_x = point_x * image_width/sizeX - offsetX 
        point_y = point_y * image_height/sizeY - offsetY
        return (point_x,point_y)

    def rotate(img, angle, landmarks):
        width, height = img.shape[:2]
        rotation = cv2.getRotationMatrix2D((width/2, height/2), angle, 1)
        rotated_img = cv2.warpAffine(img, rotation, (width, height))
        rotated_landmarks = np.asarray([np.dot(rotation, landmark.T) for landmark in landmarks])
        return rotated_img, rotated_landmarks

    # Detect face and landmarks with dlib
    
    detect = detector(image,1)


    try:
        face1 = detect[0]
    except IndexError:
        success = False
        error = "Face was not detected"
        return success, [], error
    
    shape = predictor(image, face1) #the landmarks in another form
    shape = shape_to_np(shape)
    rects = detector(image, 1) # the coordinates of the rectangles of the face

    # Get the bounding box in the face and plot it
    for k, d in enumerate(rects):
        x = d.left()
        y = d.top()
        w = d.right()
        h = d.bottom()
        # print(x,y,w,h)
        
    for ix in range(10,0,-1):
        #print(ix)
        if x-ix > 0:
            break
    for iy in range(10,0,-1):
        #print(iy)
        if y-iy > 0:
            break
    for iw in range(10,0,-1):
        #print(iw)
        if w+iw < image.shape[1]:
            break
    for ih in range(10,0,-1):
        #print(ih)
        if h-ih < image.shape[1]:
            break
            
    # offine_cropped_image = image[ y-iy:h, x-ix:w+iw]
    offine_cropped_image = image[y:h, x:w]
    offline_resized_cropped= cv2.resize(offine_cropped_image, (112,112), interpolation = cv2.INTER_AREA)
    # plt.imshow(offline_resized_cropped)

    # Cropped and resized landmarks landmarks 
    shape_cropped_resized = []
    for landmark in range(len(shape)):
        x_old = shape[landmark][0]
        y_old = shape[landmark][1]
        # (x_new, y_new) = getNewCoords(x_old, y_old, x-ix, y-iy, w+iw, h, 112, 112 )
        (x_new, y_new) = getNewCoords(x_old, y_old, x, y, w, h, 112, 112 )
        shape_cropped_resized.append((x_new, y_new))

    resized_cropped_template = offline_resized_cropped.copy()
    for (x, y) in shape_cropped_resized:
        cv2.circle(resized_cropped_template, (int(x), int(y)), 1, (0, 0, 255), -1)
    # plt.imshow(resized_cropped_template)   

    left = [36, 37, 38, 39, 40, 41] # keypoint indices for left eye
    right = [42, 43, 44, 45, 46, 47] # keypoint indices for right eye
    points_left = [shape_cropped_resized[i] for i in left]
    points_right = [shape_cropped_resized[i] for i in right]

    eye_left = bounding_box_naive(points_left)
    eye_right = bounding_box_naive(points_right)

    # Get the eyes coordinates
    ex1 = eye_left[0][0]
    ey1 = eye_left[0][1]
    ew1 = eye_left[1][0] - ex1
    ed1 = eye_left[0][1] - ey1

    ex2 = eye_right[0][0]
    ey2 = eye_right[0][1]
    ew2 = eye_right[1][0] - ex2
    ed2 = eye_right[0][1] - ey2

    left_eye = (ex1,ey1,ew1,ed1)
    right_eye = (ex2,ey2,ew2,ed2)

    # Align
    left_eye_center = (int(left_eye[0] + (left_eye[2] / 2)), int(left_eye[1] + (left_eye[3] / 2)))
    left_eye_x = left_eye_center[0] 
    left_eye_y = left_eye_center[1]
    
    right_eye_center = (int(right_eye[0] + (right_eye[2]/2)), int(right_eye[1] + (right_eye[3]/2)))
    right_eye_x = right_eye_center[0]
    right_eye_y = right_eye_center[1]
    
    cv2.circle(resized_cropped_template, left_eye_center, 5, (255, 0, 0) , -1)
    cv2.circle(resized_cropped_template, right_eye_center, 5, (255, 0, 0) , -1)
    cv2.line(resized_cropped_template,right_eye_center, left_eye_center,(0,200,200),3)
    # plt.imshow(resized_cropped_template)

    delta_x = right_eye_x - left_eye_x
    delta_y = right_eye_y - left_eye_y
    angle=np.arctan(delta_y/delta_x)
    angle = (angle * 180) / np.pi

    # Width and height of the image
    h, w = offline_resized_cropped.shape[:2]
    # Calculating a center point of the image
    # Integer division "//"" ensures that we receive whole numbers
    center = (w // 2, h // 2)
    # Defining a matrix M and calling
    # cv2.getRotationMatrix2D method
    M = cv2.getRotationMatrix2D(center, (angle), 1.0)
    # Applying the rotation to our image using the
    # cv2.warpAffine method
    rotated = cv2.warpAffine(offline_resized_cropped, M, (w, h))

    shape_cropped_resized = np.asarray(shape_cropped_resized)
    shape_cropped_resized3d = shape_cropped_resized.copy()
    ones = np.ones((68,1), dtype=int)
    shape_cropped_resized3d = np.concatenate((shape_cropped_resized3d, ones), axis=1)

    rotated_landmarks = np.asarray([np.dot(M, landmark.T) for landmark in shape_cropped_resized3d])

    rotated_template = rotated.copy()
    for (x, y) in rotated_landmarks:
        cv2.circle(rotated_template, (int(x), int(y)), 1, (0, 0, 255), -1)

    hull = ConvexHull(rotated_landmarks)
    mask = grid_points_in_poly(shape=np.array(rotated).shape, 
                    verts= list(zip(rotated_landmarks[hull.vertices][:,1], rotated_landmarks[hull.vertices][:,0])) # for some reason verts need to be flipped
                                )

    rotated[~mask] = 0
    #cur_axes = plt.gca()
    #cur_axes.axes.get_xaxis().set_visible(False)
    #cur_axes.axes.get_yaxis().set_visible(False)
    # plt.imshow(rotated)

    offline_hogs, hogs_im = hog(rotated, orientations=8, pixels_per_cell=(8, 8),
                        cells_per_block=(2, 2), visualize=True, multichannel=True) # --- check if 2 is correct! Before it was "multichannel=True" which is deprecated

    scaled_hogs = scaler.fit_transform(offline_hogs.reshape(-1,1))[0:5408].reshape(1,-1)
    pca_transformed_frame = pca_model.transform(scaled_hogs)
    feature_cbd = np.concatenate((pca_transformed_frame, rotated_landmarks.reshape(1,-1)), 1)

    offline_pred_aus = []
    for keys in classifier:
        au_pred = classifier[keys].predict(feature_cbd)
        offline_pred_aus.append(au_pred)
    predictions_output = []

    au_array = [1,2,4,5,6,7,9,10,11,12,14,15,17,20,23,24,25,26,28,43]
    predictions_output = [au_array[i] for i in range(len(offline_pred_aus)) if offline_pred_aus[i]]


    success = True
    error = ""

    return success, predictions_output, error

