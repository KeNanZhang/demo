package com.zdst.scs.supper;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;


import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

public class GsonUtil {
    private static Gson gson = null;
    static {
        if (gson == null) {
            //gson = new Gson();
            gson= new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").registerTypeAdapter(
                    new TypeToken<List<Map<String, Object>>>(){}.getType(), 
                    new JsonDeserializer<List<Map<String, Object>>>() {

    					@Override
    					public List<Map<String, Object>> deserialize(
    							JsonElement json, Type typeOfT,
    							JsonDeserializationContext context)
    							throws JsonParseException {
    						List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
    						JsonArray asJsonArray = json.getAsJsonArray();
    						for(int i=0;i<asJsonArray.size();i++){
    							Map<String, Object> treeMap = new TreeMap<>();
    			                JsonObject jsonObject = (JsonObject) asJsonArray.get(i);
    			                Set<Map.Entry<String, JsonElement>> entrySet = jsonObject.entrySet();
    			                for (Map.Entry<String, JsonElement> entry : entrySet) {
    			                    treeMap.put(entry.getKey(), entry.getValue());
    			                }
    			                list.add(treeMap);
    						}
    						
    		                return list;
    					}
                    	
                    }).create();
        }
    }

    private GsonUtil() {
    }

    /**
     * 转成json
     * 
     * @param object
     * @return
     */
    public static String GsonString(Object object) {
        String gsonString = null;
        if (gson != null) {
            gsonString = gson.toJson(object);
        }
        return gsonString;
    }

    /**
     * 转成bean
     * 
     * @param gsonString
     * @param cls
     * @return
     */
    public static <T> T GsonToBean(String gsonString, Class<T> cls) {
        T t = null;
        if (gson != null) {
            t = gson.fromJson(gsonString, cls);
        }
        return t;
    }

    /**
     * 转成list
     * 
     * @param gsonString
     * @param cls
     * @return
     */
    public static <T> List<T> GsonToList(String gsonString, Class<T> cls) {
        List<T> list = null;
        if (gson != null) {
            list = gson.fromJson(gsonString, new TypeToken<List<T>>() {
            }.getType());
        }
        return list;
    }

    /**
     * 转成list中有map的
     * 
     * @param gsonString
     * @return
     */
    public static  List<Map<String, Object>> GsonToListMaps(String gsonString) {
        List<Map<String, Object>> list = null;
        if (gson != null) {
            list = gson.fromJson(gsonString,
                    new TypeToken<List<Map<String, Object>>>() {
                    }.getType());
        }
        return list;
    }

    /**
     * 转成map的
     * 
     * @param gsonString
     * @return
     */
    public static <T> Map<String, T> GsonToMaps(String gsonString) {
        Map<String, T> map = null;
        if (gson != null) {
            map = gson.fromJson(gsonString, new TypeToken<Map<String, T>>() {
            }.getType());
        }
        return map;
    }
    
    public static <T> List<T> fromJsonList(String json, Class<T> cls) {  
        ArrayList<T> mList = new ArrayList<T>();  
        JsonArray array = new JsonParser().parse(json).getAsJsonArray();  
        for(final JsonElement elem : array){  
            mList.add(gson.fromJson(elem, cls));  
        }  
        return mList;  
    }  
    public static <T> List<T> fromResultObjectList(String json,Class<T> cls){
    	List<T> list =gson.fromJson(json, new TypeToken<List<T>>() {}.getType());
    	return list;
    }
    public static <T> List<T> fromResultObjectList(ResultObject resultObject,Class<T> cls){
    	String json = GsonUtil.GsonString(resultObject.getData());
    	List<T> list =gson.fromJson(json, new TypeToken<List<T>>() {}.getType());
    	return list;
    }
    public static <T> List<T> fromResultPageList(ResultObject resultObject,Class<T> cls){
    	  Object data = resultObject.getData();
    	  String jsonString = GsonUtil.GsonString(data);
    	  ResultPage gsonToBean = GsonUtil.GsonToBean(jsonString, ResultPage.class);
    	  return fromResultPageList(gsonToBean, cls);
    }
    public static ResultPage fromResultPage(ResultObject resultObject){
    	  ResultPage fromResultObject = fromResultObject(resultObject, ResultPage.class);
  	      return fromResultObject;
    }
    public static <T> T  fromResultObject(ResultObject resultObject,Class<T> cls){
    	  Object data = resultObject.getData();
    	  String jsonString = GsonUtil.GsonString(data);
    	  T t = GsonUtil.GsonToBean(jsonString, cls);
    	  return t;
    }  
    
    /**
     * 将ResultPage中的PageData转成List
     * @param gsonToBean
     * @param cls
     * @return
     */
    public static <T> List<T> fromResultPageList(ResultPage gsonToBean,Class<T> cls){
  	  Object pageData = gsonToBean.getPageData();
  	  if(Help.isNotNull(pageData)){
  	  String pageString = GsonUtil.GsonString(pageData);
  	  	  return fromJsonList(pageString, cls);
  	  }else{
  		  return null;
  	  }
  }
    
//    public static void main(String[] args) {
//		String str="[{\"aa\":1}]";
//		List<Map<String, Object>> gsonToListMaps = GsonUtil.GsonToListMaps(str);
//		System.out.println(gsonToListMaps);
//	}
}