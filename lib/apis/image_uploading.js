
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, GetObjectTaggingCommand, ListObjectsV2Command, CopyObjectCommand, PutObjectTaggingCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
// import GetImageDimensions from './getImageDimensions.js';
import https from 'https';
import url from 'url';
import sizeOf from 'image-size';

export const bucketName = "webos"
export const baseUrl = "https://eu.bryxocloud.com"

export function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


const s3Client = new S3Client({
    endpoint: baseUrl,
    region: "eu-dusseldorf-19946",
    credentials: {
        accessKeyId: "t2lhPVLMaaJPEOSHDcJW",
        secretAccessKey: "OkxtGqCRCulbJRK1p23wcA8YFzcmGmInsEuIeL74",
    },
    bucketEndpoint: false,
    forcePathStyle: true,
    signatureVersion: "v4",
});
// Upload Object to Contabo (S3 v3) without `webos/` in path
export async function UploadObjectCloud({ file, folder, updatedby }) {
    try {
        if (!file || !file.buffer) {
            return { error: true, message: "File is not found or send file in a buffer" };
        }
        const fileContent = file.buffer;
        let fileRoute = `files/${uuidv4()}-${file.originalname}`;

        if (folder) {
            if (folder.endsWith("/")) {
                folder = folder.slice(0, -1); // Remove the last character (the slash)
            }
            fileRoute = `${folder}/${uuidv4()}-${file?.originalname || uuidv4()}`;
        }

        // Adding the user email as metadata under the 'author' key
        const metadataObject = {
            updatedby: updatedby || 'Unknown', // If updated by is not provided, use 'Unknown'
        };

        const params = {
            Bucket: bucketName, // Your bucket name
            Key: fileRoute,
            Body: fileContent,
            ContentType: file.mimetype,
            ACL: 'public-read',
            Metadata: metadataObject, // Add metadata here
        };

        // Upload the file
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        const downloadable_url = await GetDownloadLinkCloud({ fileId: fileRoute });
        const imageUrl = `${baseUrl}/${params.Bucket}/${fileRoute}`;

        return {
            error: false,
            url: imageUrl,
            fileid: fileRoute,
            downloadable_url: downloadable_url?.error ? null : downloadable_url?.url,
            message: "File uploaded and URL generated successfully",
        };
    } catch (error) {
        return { error: true, message: error.message };
    }
}

// Upload Image to Contabo (S3 v3)
export async function UploadImageCloud({ file, folder, updatedby }) {
  try {
      // Validate the file and check if it's an image
      if (!file || !file.buffer) {
          return { error: true, message: "File is not found or send file in a buffer" };
      }

      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Add more types as needed
      if (!allowedMimeTypes.includes(file.mimetype)) {
          return { error: true, message: "Only image files are allowed" };
      }

      const fileContent = file.buffer;
      let fileRoute = `peoples/${uuidv4()}-${file.originalname}`;

      if (folder) {
          if (folder.endsWith("/")) {
              folder = folder.slice(0, -1); // Remove the last character (the slash)
          }
          fileRoute = `${folder}/${uuidv4()}-${file?.originalname || uuidv4()}`;
      }

      // Adding the user email as metadata under the 'author' key
      const metadataObject = {
          updatedby: updatedby || 'Unknown', // If updated by is not provided, use 'Unknown'
      };

      const params = {
          Bucket: bucketName, // Your bucket name
          Key: fileRoute,
          Body: fileContent,
          ContentType: file.mimetype, // Set the correct MIME type for images
          ACL: 'public-read',
          Metadata: metadataObject, // Add metadata here
      };

      // Upload the file
      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      const downloadable_url = await GetDownloadLinkCloud({ fileId: fileRoute });
      const imageUrl = `${baseUrl}/${params.Bucket}/${fileRoute}`;

      return {
          error: false,
          url: imageUrl,
          fileid: fileRoute,
          downloadable_url: downloadable_url?.error ? null : downloadable_url?.url,
          message: "Image uploaded and URL generated successfully",
      };
  } catch (error) {
      return { error: true, message: error.message };
  }
}

// Upload Multiple Files to Contabo (S3 v3)
export async function UploadMultipleObjectsCloud({ files, folder, updatedby }) {
    try {
        if (!files || files.length === 0) {
            return { error: true, message: "No files provided for upload" };
        }

        const uploadPromises = files.map(async (file) => {
            if (!file.buffer) {
                throw new Error(`File buffer is missing for ${file.originalname}`);
            }

            const fileContent = file.buffer;
            let fileRoute = `files/${uuidv4()}-${file.originalname}`;

            if (folder) {
                if (folder.endsWith("/")) {
                    folder = folder.slice(0, -1); // Remove the last character (the slash)
                }
                fileRoute = `${folder}/${uuidv4()}-${file?.originalname || uuidv4()}`;
            }

            // Adding the user email as metadata under the 'updatedby' key
            const metadataObject = {
                updatedby: updatedby || 'Unknown', // If updated by is not provided, use 'Unknown'
            };

            const params = {
                Bucket: bucketName, // Your bucket name
                Key: fileRoute,
                Body: fileContent,
                ContentType: file.mimetype,
                ACL: 'public-read',
                Metadata: metadataObject, // Add metadata here
            };

            // Upload the file
            const command = new PutObjectCommand(params);
            await s3Client.send(command);
            const imageUrl = `${baseUrl}/${params.Bucket}/${fileRoute}`;

            return {
                url: imageUrl,
                fileid: fileRoute,
            };
        });

        // Wait for all file uploads to complete
        const uploadedFiles = await Promise.all(uploadPromises);

        return {
            error: false,
            files: uploadedFiles, // Array of uploaded file results
        };

    } catch (error) {
        return { error: true, message: error.message };
    }
}

// Delete Object from Contabo (S3 v3)
export async function DeleteObjectCloud({ fileId }) {
    try {
        if (!fileId) {
            return { error: true, message: "fileId is not defined" };
        }

        const params = {
            Bucket: bucketName, // Your bucket name
            Key: fileId,
        };

        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
        return {
            error: false,
            message: "File deleted successfully",
        };
    } catch (error) {
        return { error: true, message: error.message };
    }
}

// Update Object in Contabo (S3 v3)
export async function UpdateObjectCloud({ file, folder, fileId, updatedby }) {
    try {
        if (!fileId) {
            return { error: true, message: "fileId is not defined" };
        }

        if (!file || !file.buffer) {
            return { error: true, message: "File is not found or send file in a buffer" };
        }

        // First, delete the old object
        const deleteResult = await DeleteObjectCloud({ fileId });
        if (deleteResult.error) {
            return { error: true, message: deleteResult.message };
        }

        // Then, upload the new object
        const uploadResult = await UploadObjectCloud({ file, folder, updatedby });
        if (uploadResult.error) {
            return { error: true, message: uploadResult.message };
        }

        return uploadResult;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
// Function to generate a signed URL for downloading a file
export async function GetDownloadLinkCloud({ fileId }) {
    try {
        if (!fileId) {
            return { error: true, message: "fileId is not defined" };
        }
        const fileName = fileId.split('/').pop(); // Use the last part of the fileId as the filename

        // Parameters for the S3 object you want to generate the download link for
        const params = {
            Bucket: bucketName, // Your bucket name
            Key: fileId, // The key of the file you want to download
            ResponseContentDisposition: `attachment; filename=${fileName || "downloadFile.bin"}`, // Force download with specified filename
        };

        // Generate a signed URL (valid for 1 hour / 3600 seconds)
        const downloadUrl = await getSignedUrl(s3Client, new GetObjectCommand(params), { expiresIn: 3600 });

        return {
            error: false,
            url: downloadUrl, // Return the download URL
            message: "Download URL generated successfully",
        };
    } catch (error) {
        return { error: true, message: error.message };
    }
}

export async function UploadByUrlCloud({ imageUrl, folder, updatedby }) {

    try {
        if (!imageUrl) {
            return { error: true, message: "Image URL is not defined" };
        }
        // Step 1: Fetch the image from the URL
        const imageResponse = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'arraybuffer', // Fetch the file as binary data (arraybuffer)
        });

        // Step 2: Convert the fetched image into a "file-like" object
        const file = {
            buffer: Buffer.from(imageResponse.data), // Convert response data into a buffer
            originalname: `image-from-url-${Date.now()}`, // Give it a name
            mimetype: imageResponse.headers['content-type'] || 'image/jpeg', // Infer content-type
        };
        const uploadResult = await UploadObjectCloud({ file, folder, updatedby });

        return uploadResult

    } catch (error) {

        return { error: true, message: error?.message };
    }
}

// Function to get metadata and tags of an object
// export async function GetFileDataFromCloud({ fileKey }) {
//     try {
//         // Get metadata (using HeadObjectCommand)
//         const headParams = {
//             Bucket: bucketName,
//             Key: fileKey, // The path or key of the file
//         };

//         const headCommand = new HeadObjectCommand(headParams);
//         const metadataResponse = await s3Client.send(headCommand);
//         console.log(metadataResponse);

//         // Extract metadata
//         const metadata = metadataResponse.Metadata; // This will include your custom 'x-amz-meta-*' headers

//         // Get tags (using GetObjectTaggingCommand)
//         const taggingParams = {
//             Bucket: bucketName,
//             Key: fileKey,
//         };

//         const tagCommand = new GetObjectTaggingCommand(taggingParams);
//         const tagResponse = await s3Client.send(tagCommand);
//         console.log(tagResponse);

//         // Extract tags
//         const tags = tagResponse.TagSet;

//         // Return the metadata and tags
//         return {
//             data: { tags: tagResponse, metadata: metadataResponse },
//             error: false,
//             metadata,
//             tags,
//             message: "Metadata and tags fetched successfully",
//         };
//     } catch (error) {
//         
//         return { error: true, message: error.message };
//     }
// }

// await GetFileDataFromCloud({
//     fileKey: "images/3ae501a2-d12e-4fcb-b664-69a1d94d1079-inds-10.jpg"
// }).then((res) => {
//     console.log(res);
// })


// Function to list all objects in a folder and get their metadata and tags


export async function GetAllDataByFolder({ folderName }) {
    try {
        // List all objects in the folder
        const listParams = {
            Bucket: bucketName,
            Prefix: folderName.endsWith("/") ? folderName : folderName + "/", // Add trailing slash if not present
        };

        const listCommand = new ListObjectsV2Command(listParams);
        const listResponse = await s3Client.send(listCommand);

        const files = listResponse.Contents;

        if (!files || files.length === 0) {
            return { error: true, message: "No files found in the folder." };
        }

        const resultData = [];

        // Loop through each file and fetch metadata and tags
        for (const file of files) {
            const fileKey = file.Key;

            // Get metadata using HeadObjectCommand
            const headParams = {
                Bucket: bucketName,
                Key: fileKey,
            };

            const headCommand = new HeadObjectCommand(headParams);
            const metadataResponse = await s3Client.send(headCommand);
            const metadata = metadataResponse.Metadata;

            // Get tags using GetObjectTaggingCommand
            const taggingParams = {
                Bucket: bucketName,
                Key: fileKey,
            };

            const tagCommand = new GetObjectTaggingCommand(taggingParams);
            const tagResponse = await s3Client.send(tagCommand);
            const tags = tagResponse.TagSet;

            // Construct a direct URL for the file
            const fileUrl = `https://eu.bryxocloud.com/${bucketName}/${fileKey}`;

            // Collect all file data (URL, metadata, tags)
            resultData.push({
                fileUrl,
                fileKey,
                metadata,
                tags,
            });
        }

        return {
            error: false,
            data: resultData,
            message: "Data retrieved successfully from the folder.",
        };

    } catch (error) {
        return { error: true, message: error.message };
    }
}



// Function to get folder names, subfolder count, and file count within one level (no recursion)
export async function GetFolderDetails({ parentFolder = '' }) {
    try {
        // Treat an empty or undefined `parentFolder` as the root directory
        const isRoot = !parentFolder || parentFolder === '' || parentFolder === '/';

        // List all objects in the bucket or under a specific prefix (folder)
        const listParams = {
            Bucket: bucketName,
            Prefix: isRoot ? '' : parentFolder.endsWith("/") ? parentFolder : parentFolder + "/", // Set to root if parentFolder is empty
            Delimiter: '/', // This will separate folders from files
        };

        const listCommand = new ListObjectsV2Command(listParams);
        const listResponse = await s3Client.send(listCommand);

        const files = listResponse.Contents; // Direct files in the current folder
        const subfolders = listResponse.CommonPrefixes; // Subfolders in the current folder

        if ((!files || files.length === 0) && (!subfolders || subfolders.length === 0)) {
            return { error: true, message: "No files or folders found in the specified directory." };
        }

        // Initialize file and subfolder counts
        let fileCount = 0;
        let subfolderCount = 0;

        // Count the number of files directly in this folder (not in subfolders)
        if (files && files.length > 0) {
            fileCount = files.length;
        }

        // Count the number of subfolders in this folder
        if (subfolders && subfolders.length > 0) {
            subfolderCount = subfolders.length;
        }

        // For each subfolder, get the count of files and subfolders inside it (no recursion)
        let subfolderDetails = [];
        if (subfolders && subfolders.length > 0) {
            for (const subfolder of subfolders) {
                const subfolderName = subfolder.Prefix; // Full path to the subfolder

                // Fetch the files and subfolders inside this subfolder (one level deep)
                const subfolderParams = {
                    Bucket: bucketName,
                    Prefix: subfolderName,
                    Delimiter: '/',
                };

                const subfolderCommand = new ListObjectsV2Command(subfolderParams);
                const subfolderResponse = await s3Client.send(subfolderCommand);

                const subfolderFiles = subfolderResponse.Contents || [];
                const subfolderSubfolders = subfolderResponse.CommonPrefixes || [];

                subfolderDetails.push({
                    folder: subfolderName, // The subfolder name
                    fileCount: subfolderFiles.length, // Number of files inside this subfolder
                    subfolderCount: subfolderSubfolders.length, // Number of subfolders inside this subfolder
                });
            }
        }

        // Return the result with one-level subfolder details
        return {
            error: false,
            folder: parentFolder || "/", // Return "root" if querying the root folder
            fileCount: fileCount,
            subfolderCount: subfolderCount,
            subfolders: subfolderDetails, // Only the immediate subfolders
            // files: files ? files.map(file => file.Key) : [], // Only the immediate files
        };

    } catch (error) {
        return { error: true, message: error.message };
    }
}
// Function to list all objects (no filtering by prefix)
export async function ListAllObjects() {
    try {
        const listParams = {
            Bucket: bucketName,
        };

        const listCommand = new ListObjectsV2Command(listParams);
        const listResponse = await s3Client.send(listCommand);

        const files = listResponse.Contents;

        if (!files || files.length === 0) {
            return { error: true, message: "No objects found in the bucket." };
        }

        // Return all object keys (file paths)
        const objectKeys = files.map(file => file.Key);

        return {
            error: false,
            objectKeys,
            message: "Objects retrieved successfully."
        };

    } catch (error) {
        return { error: true, message: error?.message || "Something went wrong" };
    }
}


// Function to get folders and files in the root or a specific folder
export async function GetRootFoldersAndFilesWithDetails({ folderName = "" }) {
    try {
        // Determine if we are querying the root folder or a specific folder
        const prefix = folderName ? (folderName.endsWith("/") ? folderName : folderName + "/") : "";

        const listParams = {
            Bucket: bucketName,
            Prefix: prefix, // Querying the root if folderName is empty
            Delimiter: '/', // This will group objects by folders (anything before '/')
        };

        const listCommand = new ListObjectsV2Command(listParams);
        const listResponse = await s3Client.send(listCommand);

        // Extract the folder names from CommonPrefixes (subdirectories)
        const folderNames = listResponse.CommonPrefixes?.map(prefix => prefix.Prefix) || [];

        // Create an array to store all file details separately from folders
        const fileDetailsList = [];

        // Process files in the current folder (if any)
        if (listResponse.Contents && listResponse.Contents.length > 0) {
            for (const file of listResponse.Contents) {
                const fileKey = file.Key;

                // Get file metadata using HeadObjectCommand
                const metadataParams = { Bucket: bucketName, Key: fileKey };
                const headCommand = new HeadObjectCommand(metadataParams);
                const metadataResponse = await s3Client.send(headCommand);

                // Get file tags using GetObjectTaggingCommand
                const taggingParams = { Bucket: bucketName, Key: fileKey };
                const tagCommand = new GetObjectTaggingCommand(taggingParams);
                const tagResponse = await s3Client.send(tagCommand);

                // Construct file URL
                const fileUrl = `${baseUrl}/${bucketName}/${fileKey}`;

                // Add file details to the list
                fileDetailsList.push({
                    folder: folderName || "root", // The folder this file belongs to (root if no folderName is provided)
                    fileKey, // File key (path)
                    url: fileUrl, // File URL
                    metadata: metadataResponse.Metadata || {}, // Metadata
                    tags: tagResponse.TagSet || [], // Tags
                });
            }
        }

        return {
            error: false,
            folders: folderNames, // Just the folder names
            files: fileDetailsList, // Detailed file information
            message: folderName ? `Data retrieved from folder: ${folderName}` : "Data retrieved from root directory."
        };

    } catch (error) {
        return { error: true, message: error.message };
    }
}


export async function GetFoldersAndFilesWithPagination({
    folderName = "",
    maxKeys = 10, // Number of items per page
    continuationToken = null // Token for pagination
}) {
    try {
        const supportedImageFormats = ['.jpg', '.jpeg', '.png'];
        // Construct the prefix for the S3 listing
        const prefix = folderName ? (folderName.endsWith("/") ? folderName : folderName + "/") : "";
        const MaximumKeys = prefix ? maxKeys : 10; // Use maxKeys only if prefix is defined

        const listParams = {
            Bucket: bucketName,
            Prefix: prefix,
            Delimiter: '/',
            MaxKeys: MaximumKeys,
            ContinuationToken: continuationToken, // Token for pagination
        };

        const listCommand = new ListObjectsV2Command(listParams);
        const listResponse = await s3Client.send(listCommand); // Fetch S3 objects list

        // Extract folder names from CommonPrefixes
        const folderNames = listResponse.CommonPrefixes?.map(prefix => prefix.Prefix) || [];

        // Initialize an array to store file details
        const fileDetailsList = [];

        // Process each file in the current folder
        if (listResponse.Contents && listResponse.Contents.length > 0) {
            for (const file of listResponse.Contents) {
                const fileKey = file.Key;

                // Skip processing for folders (keys ending with '/')
                if (fileKey.endsWith('/')) continue;

                // Wrap metadata and tagging fetching in try-catch for error isolation
                try {
                    const metadataParams = { Bucket: bucketName, Key: fileKey };
                    const headCommand = new HeadObjectCommand(metadataParams);
                    const metadataResponse = await s3Client.send(headCommand);

                    const taggingParams = { Bucket: bucketName, Key: fileKey };
                    const tagCommand = new GetObjectTaggingCommand(taggingParams);
                    const tagResponse = await s3Client.send(tagCommand);

                    const fileUrl = `${baseUrl}/${bucketName}/${fileKey}`;

                    // Initialize sizedata as empty object
                    let sizedata = {};
                    try {
                        // Ensure the fileUrl is a valid image before proceeding (Check file extension)
                        if (fileUrl && supportedImageFormats?.some(format => fileUrl.toLowerCase().endsWith(format))) {
                            sizedata = await new Promise((resolve, reject) => {
                                const options = url.parse(fileUrl); // Parse the file URL
                                https.get(options, function (response) {
                                    const chunks = [];
                                    response.on("data", function (chunk) {
                                        chunks.push(chunk); // Collect data chunks
                                    })
                                        .on("end", function () {
                                            const buffer = Buffer.concat(chunks); // Concatenate chunks into a buffer
                                            try {
                                                // Check if the buffer is a valid image before calculating size
                                                const dimensions = sizeOf(buffer); // Get the image dimensions
                                                resolve(dimensions); // Resolve with dimensions
                                            } catch (err) {
                                                console.error("Error calculating image size:", err);
                                                reject({ error: 'Error calculating image size' }); // Reject if size calculation fails
                                            }
                                        });
                                }).on('error', (err) => {
                                    console.error("Error fetching image:", err);
                                    reject({ error: 'Error fetching the image' }); // Reject on error in HTTP request
                                });
                            });
                        } else {
                            throw new Error("File is not a valid image type (jpg, jpeg, png).");
                        }
                    } catch (error) {
                        // console.error("Error fetching image size:", error);
                        sizedata = {}; // Fallback if image size fetch fails
                    }

                    // Add file details to the list
                    fileDetailsList.push({
                        folder: folderName || "/", // Folder name, default to root if not provided
                        fileKey, // File path (key)
                        url: fileUrl, // Constructed file URL
                        metadata: metadataResponse?.Metadata || {}, // File metadata
                        tags: tagResponse?.TagSet || [], // File tags
                        sizedata: sizedata || {}, // Image size data (if any)
                        mimeType: metadataResponse?.ContentType || 'application/octet-stream', // MIME type
                        ContentSize: metadataResponse?.ContentLength ? formatBytes(metadataResponse?.ContentLength) : '0 Bytes', // File size in human-readable format
                        ContentLength: metadataResponse?.ContentLength || 0, // Original file size in bytes
                        LastModified: metadataResponse?.LastModified || new Date(), // Last modified date
                        ETag: metadataResponse?.ETag, // ETag for the file
                    });
                } catch (innerError) {
                    console.error("Error processing file:", innerError);
                    // Log the error for this file and continue with the other files
                    fileDetailsList.push({ error: true, message: innerError.message });
                }
            }
        }

        // Return the response with folders and files data
        return {
            error: false,
            folders: folderNames, // List of folder names (subdirectories)
            files: fileDetailsList, // List of file details
            isTruncated: listResponse?.IsTruncated, // Whether there are more results to fetch
            nextContinuationToken: listResponse?.NextContinuationToken || null, // Continuation token for pagination
            message: folderName ? `Data retrieved from folder: ${folderName}` : "Data retrieved from root directory." // Message indicating source of data
        };

    } catch (error) {
        // Catch any errors that occur during the entire process
        console.error("Error in GetFoldersAndFilesWithPagination:", error); // Log the error
        return { error: true, message: error?.message || "Internal server error", sizedata: {} }; // Return error response with message
    }
}

export async function UpdateFileMetadataAndTags({
    fileid,
    newMetadata = {}, // New metadata to replace
    newTags = [], // New tags to replace
}) {
    try {
        // Validate tags before sending them to S3
        const validTags = newTags.filter(tag => {
            // Ensure that TagKey and TagValue are not empty and comply with S3 naming rules
            return tag.Key && tag.Key.trim() !== '' && /^[A-Za-z0-9+=._:/@-]+$/.test(tag.Key) &&
                (tag.Value || tag.Value === ''); // Value can be empty string but not null or undefined
        });

        // Ensure there are valid tags
        if (validTags.length !== newTags.length) {
            throw new Error("Invalid TagKey or TagValue. Ensure keys are non-empty and contain only valid characters.");
        }

        // Step 1: Retrieve existing object metadata (to preserve ContentType)
        const headCommand = new HeadObjectCommand({ Bucket: bucketName, Key: fileid });
        const headResponse = await s3Client.send(headCommand);

        // Step 2: Replace the metadata by copying the object to itself with new metadata
        const copyParams = {
            Bucket: bucketName,
            CopySource: `${bucketName}/${fileid}`, // Copy the object to itself
            Key: fileid,
            Metadata: newMetadata, // New metadata to replace the existing metadata
            MetadataDirective: 'REPLACE', // Completely replace existing metadata
            ContentType: headResponse.ContentType, // Preserve the content type
        };

        const copyCommand = new CopyObjectCommand(copyParams);
        const MetadataSend = await s3Client.send(copyCommand);
        // Step 3: Replace the tags using PutObjectTaggingCommand
        const tagParams = {
            Bucket: bucketName,
            Key: fileid,
            Tagging: {
                TagSet: validTags, // New tag set to replace the old tags
            },
        };

        const taggingCommand = new PutObjectTaggingCommand(tagParams);
        const TaggsSend = await s3Client.send(taggingCommand);
        return {
            error: false,
            message: "Metadata and tags replaced successfully",
        };
    } catch (error) {
        console.error(error);
        return { error: true, message: error.message };
    }
}